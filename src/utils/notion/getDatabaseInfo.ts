// src/utils/notion/getDatabaseInfo.ts
import { Client } from '@notionhq/client';

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

export interface DatabaseInfo {
  id: string;
  title: string;
  properties: Record<string, { type: string; [key: string]: unknown }>;
}

/**
 * Retrieves properties and metadata of the specified Notion database.
 * @param databaseId - The ID of the Notion database.
 * @returns Database metadata including properties and types.
 */
export async function getNotionDatabaseInfo(databaseId: string): Promise<DatabaseInfo> {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY environment variable is required');
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  try {
    const response = await notion.databases.retrieve({ database_id: databaseId }) as unknown as NotionDatabaseResponse;
    return {
      id: response.id,
      title: response.title?.[0]?.plain_text || 'Untitled Database',
      properties: response.properties,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve database info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates if required fields exist in the database properties.
 * @param properties - The properties object from getNotionDatabaseInfo.
 * @returns Boolean indicating if all required fields are present.
 */
export function validateRequiredFields(properties: Record<string, unknown>): boolean {
	const requiredFields = ["slug", "destination", "Link Tree Enabled"];
	return requiredFields.every((field) => field in properties);
}

// Example usage for development/testing
if (process.env.NODE_ENV === "development") {
	const dbId = process.env.NOTION_DATABASE_ID || "your-database-id"; // Set in env
	getNotionDatabaseInfo(dbId)
		.then((info) => {
			console.log("Database Title:", info.title);
			console.log("Properties:", JSON.stringify(info.properties, null, 2));
			console.log(
				"Required Fields Valid:",
				validateRequiredFields(info.properties),
			);
		})
		.catch(console.error);
}
