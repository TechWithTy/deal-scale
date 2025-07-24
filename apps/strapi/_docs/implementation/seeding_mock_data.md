# Guide: Seeding Strapi with Local Mock Data

- **Author**: Ty the Programmer
- **Status**: New
- **Date**: 2025-07-15

---

## 1. Overview

This guide provides a step-by-step process for uploading your project's local mock data into your Strapi CMS. We will create a reusable script that leverages your existing TypeScript types and Zod schemas to ensure data integrity. This approach is ideal for initial data seeding and for resetting your development environment with a consistent dataset.

## 2. The Strategy: A Custom Seeding Script

Instead of using Strapi's data transfer tools (which are meant for migrating between Strapi instances), we will create a Node.js script inside your Strapi project. This gives us the flexibility to:

- Read data from any source (your mock data files).
- Validate each entry against your Zod schemas before uploading.
- Map fields from your mock data to the fields in your Strapi Content Types.

---

## 3. Implementation Steps

### Step 1: Prerequisites

1.  **Running Strapi Instance**: Ensure your local, Dockerized Strapi instance is running.
2.  **Content Types Created**: In the Strapi Admin UI, create the Content Types (`CaseStudy`, `Service`, etc.) that will receive the data.
3.  **Enable API Permissions**: For each Content Type, go to `Settings` -> `Roles` -> `Public` (or a dedicated script role) and enable the `create` and `find` permissions.

### Step 2: Create the Seeding Script

In your Strapi project's root directory, create a new file: `scripts/seed.ts`.

```typescript
// scripts/seed.ts
import { z } from 'zod';
import axios from 'axios';

// --- 1. Configuration ---
const STRAPI_API_URL = 'http://localhost:1337/api';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // Set this in a .env file

if (!STRAPI_API_TOKEN) {
  throw new Error('STRAPI_API_TOKEN is not set in your .env file');
}

const api = axios.create({
  baseURL: STRAPI_API_URL,
  headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
});

// --- 2. Zod Schemas & Types (Import or define) ---
// This schema should match the FINAL structure you send to Strapi
const caseStudyStrapiSchema = z.object({
  title: z.string(),
  slug: z.string(),
  short_summary: z.string(), // Field name in Strapi
});
type CaseStudyStrapi = z.infer<typeof caseStudyStrapiSchema>;

// --- 3. Mock Data (Import or define) ---
// This is your raw mock data, which may have a different structure
const rawMockCaseStudies = [
  { name: 'Case Study 1', id: 'case-study-1', summary: 'Summary 1' },
  { name: 'Case Study 2', id: 'case-study-2', summary: 'Summary 2' },
];

// --- 4. Data Mapper Function ---
// This function transforms raw mock data into the Strapi content type structure
function mapCaseStudy(raw: typeof rawMockCaseStudies[0]): CaseStudyStrapi {
  return {
    title: raw.name, // Map 'name' to 'title'
    slug: raw.id,      // Map 'id' to 'slug'
    short_summary: raw.summary, // Map 'summary' to 'short_summary'
  };
}

// --- 5. Generic Seeding Function ---
type StrapiPayload<T> = { data: T };

async function seedCollection<Raw, Transformed>(
  endpoint: string,
  rawData: Raw[],
  mapper: (item: Raw) => Transformed,
  schema: z.ZodSchema<Transformed>
) {
  console.log(`\n🌱 Seeding ${endpoint}...`);

  for (const rawItem of rawData) {
    let transformedItem;
    try {
      // 1. Transform the data
      transformedItem = mapper(rawItem);
      // 2. Validate the TRANSFORMED data
      schema.parse(transformedItem);

      const payload: StrapiPayload<Transformed> = { data: transformedItem };

      await api.post(`/${endpoint}`, payload);
      console.log(`✅ Successfully created: ${transformedItem.title}`);
    } catch (error) {
      const title = transformedItem?.title || rawItem.name;
      if (error instanceof z.ZodError) {
        console.error(`❌ Validation failed for '${title}':`, error.errors);
      } else {
        console.error(`❌ API Error for '${title}':`, error.response?.data || error.message);
      }
    }
  }
}

// --- 6. Main Execution ---
async function main() {
  console.log('🚀 Starting data seeding...');

  await seedCollection(
    'case-studies',
    rawMockCaseStudies,
    mapCaseStudy,
    caseStudyStrapiSchema
  );

  // ... add other collections here with their own mappers and schemas

  console.log('\n✨ Seeding complete!');
}

main().catch((error) => {
  console.error('🔥 Seeding script failed:', error);
});
```

### Step 3: Add a Script to `package.json`

In your Strapi project's `package.json`, add a new script to run your seeder.

```json
// package.json (in your Strapi project)
"scripts": {
  // ... other scripts
  "db:seed": "ts-node scripts/seed.ts"
},
```

*Note: You may need to install `ts-node` and `axios` in your Strapi project: `pnpm add ts-node axios`*

### Step 4: Run the Seeder

From your Strapi project's root directory, simply run:

```bash
pnpm run db:seed
```

Your terminal will show the progress as the script transforms, validates, and uploads each item.

---

## 4. Best Practices

-   **Environment Variables**: Always use an environment variable (`.env`) for your Strapi API token. Do not hardcode it.
-   **Idempotency**: Consider adding a function to delete existing content before seeding to make the script idempotent (runnable multiple times with the same result). Be careful with this in production.
-   **Modularize**: For many content types, split your schemas, data imports, and `seedCollection` calls into separate, well-organized files.
-   **Error Handling**: The provided script includes basic error handling to show which records failed and why (either validation or API errors).
