// src/utils/notion/getDatabaseInfo.ts
// Use CommonJS require for compatibility
const { Client } = require('@notionhq/client');

// Define a custom interface based on Notion's API response
interface NotionDatabaseResponse {
  id: string;
  title?: Array<{
    type: 'text';
    text: {
      content: string;
      link: { url: string } | null;
    };
    plain_text: string;
  }>;
  properties: Record<string, { type: string; [key: string]: unknown }>;
}

interface DatabaseInfo {
  id: string;
  title: string;
  properties: Record<string, { type: string; [key: string]: unknown }>;
}

/**
 * Retrieves properties and metadata of the specified Notion database.
 * @param databaseId - The ID of the Notion database.
 * @returns Database metadata including properties and types.
 */
async function getNotionDatabaseInfo(databaseId: string): Promise<DatabaseInfo> {
  console.log('Starting getNotionDatabaseInfo with databaseId:', databaseId);
  console.log('NOTION_API_KEY present:', !!process.env.NOTION_API_KEY);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY environment variable is required');
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  console.log('Notion client created');

  try {
    console.log('Attempting to retrieve database...');
    const response = await notion.databases.retrieve({ database_id: databaseId }) as unknown as NotionDatabaseResponse;
    console.log('Database retrieved successfully:', response.id);
    console.log('Response title:', response.title);
    console.log('Response properties keys:', Object.keys(response.properties));

    return {
      id: response.id,
      title: response.title?.[0]?.plain_text || 'Untitled Database',
      properties: response.properties,
    };
  } catch (error) {
    console.error('Error in getNotionDatabaseInfo:', error);
    throw new Error(`Failed to retrieve database info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates if required fields exist in the database properties.
 * @param properties - The properties object from getNotionDatabaseInfo.
 * @returns Boolean indicating if all required fields are present.
 */
function validateRequiredFields(properties: Record<string, unknown>): boolean {
  console.log('Validating fields in properties:', Object.keys(properties));
  const requiredFields = ['slug', 'destination', 'Link Tree Enabled'];
  return requiredFields.every(field => field in properties);
}

// Export using CommonJS
module.exports = {
  getNotionDatabaseInfo,
  validateRequiredFields,
};

// Example usage for development/testing
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
  const dbId = process.env.NOTION_DATABASE_ID || 'your-database-id'; // Set in env
  console.log('Using database ID:', dbId);
  getNotionDatabaseInfo(dbId)
    .then(info => {
      console.log('Database Title:', info.title);
      console.log('Properties:', JSON.stringify(info.properties, null, 2));
      console.log('Required Fields Valid:', validateRequiredFields(info.properties));
    })
    .catch(console.error);
}
