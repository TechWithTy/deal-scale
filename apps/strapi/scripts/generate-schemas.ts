import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// --- 1. Define Your Zod Schema ---
// ! IMPORTANT: In a real project, you would import this from a shared lib
// ! For example: import { caseStudySchema } from '../../shared/schemas/case-study';
const caseStudySchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  short_summary: z.string(),
  is_featured: z.boolean().default(false),
  published_date: z.date(),
});

// --- 2. Zod to Strapi Type Mapping ---
// ? This map can be extended to support more complex Strapi fields like 'media', 'relation', 'component', etc.
const zodToStrapiTypeMap: Record<string, string> = {
  ZodString: 'string',
  ZodNumber: 'integer',
  ZodBoolean: 'boolean',
  ZodDate: 'date',
  ZodBigInt: 'biginteger',
  ZodObject: 'json',
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
    collectionName: `case_studies`, // Strapi uses snake_case for table names
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

    // Define the path for the content-type schema.json
    const apiName = name.toLowerCase();
    const dirPath = path.resolve(__dirname, `../../src/api/${apiName}/content-types/${apiName}`);
    const filePath = path.join(dirPath, 'schema.json');

    try {
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(strapiSchema, null, 2));
      console.log(`✅ Schema written to: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error writing schema for ${name}:`, error);
    }
  }

  console.log('\n✨ Schema generation complete! Please restart your Strapi server.');
}

main();
