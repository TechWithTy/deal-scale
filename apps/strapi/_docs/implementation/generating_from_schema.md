# Guide: Generating Strapi Content Types from Zod Schemas

- **Author**: Ty the Programmer
- **Status**: New
- **Date**: 2025-07-15

---

## 1. Overview

This guide details a "schema-first" approach to Strapi development. We will create a script that reads your Zod schemas—the single source of truth for your data shapes—and automatically generates the corresponding Strapi Content Type `schema.json` files. This ensures perfect synchronization between your frontend types and your backend CMS structure.

## 2. The Strategy: Zod-to-Strapi Conversion

The process involves three main parts:

1.  **Centralized Schemas**: Keep your Zod schemas in a shared location, accessible by both your Next.js frontend and this new Strapi script.
2.  **Converter Script**: A Node.js script that imports a Zod schema, translates its structure into Strapi's required JSON format, and saves it.
3.  **File Generation**: The script will place the generated `schema.json` file into the correct directory within your Strapi project, effectively creating or updating the content type.

---

## 3. Implementation

### Step 1: Install Dependencies

In your Strapi project, you'll need a way to handle file paths and potentially Zod, if it's not already part of a shared workspace.

```bash
# In your Strapi project root
pnpm add -D ts-node zod
```

### Step 2: Create the Generator Script

Create a new file in your Strapi project at `scripts/generate-schemas.ts`.

```typescript
// scripts/generate-schemas.ts
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// --- 1. Define Your Zod Schema ---
// In a real project, you would import this from a shared lib
const caseStudySchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  short_summary: z.string(),
  is_featured: z.boolean().default(false),
  published_date: z.date(),
});

// --- 2. Zod to Strapi Type Mapping ---
const zodToStrapiTypeMap: Record<string, string> = {
  ZodString: 'string',
  ZodNumber: 'integer',
  ZodBoolean: 'boolean',
  ZodDate: 'date',
  // Add other mappings as needed (e.g., for text, rich text, relations)
};

// --- 3. The Converter Function ---
function generateStrapiSchema(schemaName: string, zodSchema: z.ZodObject<any>) {
  const attributes: Record<string, any> = {};

  for (const key in zodSchema.shape) {
    const field = zodSchema.shape[key];
    const fieldType = field._def.typeName;

    const strapiType = zodToStrapiTypeMap[fieldType];
    if (!strapiType) {
      console.warn(`! No mapping found for Zod type: ${fieldType} in field '${key}'. Skipping.`);
      continue;
    }

    attributes[key] = { type: strapiType };

    // Add required constraint if the field is not optional
    if (!field.isOptional()) {
      attributes[key].required = true;
    }
  }

  const strapiSchema = {
    kind: 'collectionType',
    collectionName: `${schemaName.toLowerCase()}s`, // Pluralize
    info: {
      singularName: schemaName.toLowerCase(),
      pluralName: `${schemaName.toLowerCase()}s`,
      displayName: schemaName,
    },
    options: {
      draftAndPublish: true,
    },
    attributes,
  };

  return strapiSchema;
}

// --- 4. Main Execution ---
function main() {
  console.log('🚀 Starting schema generation...');

  const schemasToGenerate = [
    { name: 'CaseStudy', schema: caseStudySchema },
    // { name: 'Service', schema: serviceSchema },
  ];

  for (const { name, schema } of schemasToGenerate) {
    console.log(`
🔄 Generating schema for ${name}...`);
    const strapiSchema = generateStrapiSchema(name, schema);

    const dirPath = path.resolve(__dirname, `../src/api/${name.toLowerCase()}/content-types/${name.toLowerCase()}`);
    const filePath = path.join(dirPath, 'schema.json');

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(strapiSchema, null, 2));

    console.log(`✅ Schema written to: ${filePath}`);
  }

  console.log('\n✨ Schema generation complete! Please restart your Strapi server.');
}

main();

```

### Step 3: Add Script to `package.json`

In your Strapi project's `package.json`, add the script:

```json
// package.json
"scripts": {
  // ...
  "schema:generate": "ts-node scripts/generate-schemas.ts"
},
```

### Step 4: Run the Generator

Now, you can generate your content types at any time by running:

```bash
pnpm run schema:generate
```

After the script runs, you will see new folders and `schema.json` files inside your `src/api/` directory. **You must restart your Strapi server** for it to recognize the new or updated content types.
