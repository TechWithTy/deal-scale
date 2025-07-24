const crypto = require('crypto');

const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const secrets = {
  // App
  APP_KEYS: `${generateSecret()},${generateSecret()}`,
  API_TOKEN_SALT: generateSecret(),
  ADMIN_JWT_SECRET: generateSecret(),
  TRANSFER_TOKEN_SALT: generateSecret(),
  
  // API
  JWT_SECRET: generateSecret(),
};

// Output the .env content
let envContent = `# Generated on ${new Date().toISOString()}
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

# App
NODE_ENV=development
HOST=0.0.0.0
PORT=1337
`;

// Add the generated secrets
Object.entries(secrets).forEach(([key, value]) => {
  envContent += `${key}=${value}\n`;
});

console.log(envContent);
