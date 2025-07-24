# Deal Scale - Strapi CMS

This is the Strapi CMS for the Deal Scale platform, providing a headless CMS for managing content.

## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher recommended)
- Yarn (v1.22 or higher)

## Getting Started

1. **Clone the repository** (if you haven't already)
   ```bash
   git clone https://github.com/your-username/deal-scale.git
   cd deal-scale/apps/strapi
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file and update the values as needed.

3. **Start the development environment**
   ```bash
   # Build and start the containers
   docker-compose up --build -d
   ```

4. **Access the applications**
   - Strapi Admin: http://localhost:1337/admin
   - Adminer (Database UI): http://localhost:8080
     - System: PostgreSQL
     - Server: postgres
     - Username: strapi
     - Password: strapi
     - Database: strapi

## Development

### Available Scripts

- `yarn dev`: Start the development server with Docker Compose
- `yarn build`: Build the Strapi admin panel
- `yarn develop`: Start the Strapi development server
- `yarn start`: Start the Strapi server in production mode
- `yarn db:seed`: Seed the database with initial data
- `yarn stop`: Stop all Docker containers
- `yarn clean`: Stop and remove all Docker containers and volumes

### Project Structure

```
apps/strapi/
├── .dockerignore     # Files to ignore in Docker build
├── .env.example     # Example environment variables
├── Dockerfile       # Docker configuration
├── README.md        # This file
├── docker-compose.yml # Docker Compose configuration
├── package.json     # Project dependencies and scripts
└── src/             # Strapi application code
    ├── api/         # API and content-types
    ├── components/  # Reusable components
    ├── extensions/  # Extensions
    ├── policies/    # Route policies
    └── middlewares/ # Custom middlewares
```

## Deployment

For production deployment, refer to the deployment documentation in `_docs/front_end_best_practices/_infrastructure/_cms/strapi/implementation/`.

## License

MIT
