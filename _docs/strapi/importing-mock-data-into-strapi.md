# Importing Zod/TypeScript Mock Data into Strapi (v5)

This guide summarizes the most efficient, officially-documented ways to bring your Zod/TypeScript mock data into Strapi. Choose the approach that best matches your use case.

References:
- Data import CLI: https://docs.strapi.io/cms/data-management/import
- Data transfer CLI: https://docs.strapi.io/cms/data-management/transfer
- Data export CLI: https://docs.strapi.io/cms/data-management/export
- Database migrations: https://docs.strapi.io/cms/database-migrations

## When to use which method

- **Bulk project snapshot (all or large subsets)**: Use the Strapi CLI **Data Import** (best for restoring/exporting datasets, including assets).
- **Sync data between environments**: Use **Data Transfer** CLI (source → destination over HTTP using transfer token).
- **Seeding mock data from TypeScript/Zod at dev time**: Use a **scripted seed** with Strapi instance + `entityService` (most flexible, type-safe transforms, easy to run locally/CI).
- **Schema/data evolutions tied to code versioning**: Use **Database Migrations** for repeatable, idempotent inserts/updates.
- **One-off programmatic injections from outside Strapi**: Use **REST/GraphQL API** with an admin/API token.

---

## Prepare your mock data (Zod)

Validate data before inserting into Strapi. Example:

```ts
import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().min(1),
  authorEmail: z.string().email(),
  // relate to Strapi models via IDs or unique fields
});

export type Article = z.infer<typeof ArticleSchema>;
```

Run `ArticleSchema.parse()` or `safeParse()` before insert.

---

## Option A — Data Import CLI (best for full/bulk, including assets)

- Import requires a Strapi export archive (`.tar`) created by the Export CLI.
- Useful when you already have a Strapi export or want to standardize dev DB via files.

Docs: https://docs.strapi.io/cms/data-management/import

Examples (run in your Strapi project root):

```bash
# Minimum
strapi import --file ./my-dataset.tar

# With key (if archive is encrypted)
strapi import --file ./my-dataset.tar --key "$IMPORT_KEY"

# Include/exclude types
strapi import --file ./my-dataset.tar --only data,assets
strapi import --file ./my-dataset.tar --exclude assets
```

Workflow with mock data:
1) Convert your mock data into a running Strapi instance using Option B or D below, then
2) Use Export CLI to produce a reusable `.tar` (see Export docs), and
3) Share/import that archive across teammates/CI.

---

## Option B — Scripted Seed using Strapi instance (Recommended for TS/Zod mocks)

Use a Node script to boot Strapi and call `entityService`. This keeps data shaping in TypeScript and lets you validate inputs with Zod.

High-level steps:
1) Add a script (e.g., `scripts/seed.ts`) that:
   - Starts Strapi programmatically
   - Loads your mock data
   - Validates with Zod
   - Resolves relations/IDs
   - Creates/updates data via `entityService`
   - Uploads media if needed
2) Run it locally with `pnpm ts-node scripts/seed.ts` (or compile first), and add a `package.json` script (e.g., `seed:mock`).

Example (TypeScript, minimal):

```ts
// scripts/seed.ts
import path from 'node:path';
import fs from 'node:fs/promises';
import { ArticleSchema } from '../path-to/your-zod-schemas';
import { createStrapi } from '@strapi/strapi';

async function main() {
  const appDir = path.resolve(__dirname, '..');
  const strapi = await createStrapi({ appDir });
  await strapi.start();

  const raw = await fs.readFile(path.join(appDir, 'data', 'data.json'), 'utf8');
  const data = JSON.parse(raw);

  for (const input of data.articles) {
    const parsed = ArticleSchema.parse(input);

    // Example: find related author by unique field (email)
    const [author] = await strapi.entityService.findMany('api::author.author', {
      filters: { email: parsed.authorEmail },
      limit: 1,
    });

    await strapi.entityService.create('api::article.article', {
      data: {
        title: parsed.title,
        slug: parsed.slug,
        body: parsed.body,
        author: author?.id ?? null,
      },
    });
  }

  await strapi.destroy();
}

main().catch(async (err) => {
  console.error(err);
  process.exitCode = 1;
});
```

Media upload (Upload plugin):

```ts
import { Readable } from 'node:stream';

async function uploadFile(strapi: any, absFilePath: string) {
  const buffer = await fs.readFile(absFilePath);
  const stream = Readable.from(buffer);

  const uploaded = await strapi.plugin('upload').service('upload').upload({
    data: {},
    files: {
      path: absFilePath,
      name: path.basename(absFilePath),
      type: 'image/jpeg', // set correctly
      size: buffer.length,
      stream,
    },
  });
  return uploaded?.[0];
}
```

Tips:
- Batch inserts in manageable sizes to avoid DB/connection pressure.
- Make seed idempotent (check for existing records via unique fields before create; update or skip accordingly).
- Store created Strapi IDs if you need deterministic relations between runs.

---

## Option C — Data Transfer CLI (env-to-env sync)

For moving data from one Strapi instance to another (e.g., staging → local).

Docs: https://docs.strapi.io/cms/data-management/transfer

Key points:
- Generate a transfer token on the destination.
- Run transfer from source to destination via CLI.
- Include/exclude data types and bypass prompts with `--force`.

---

## Option D — REST API seeding (outside Strapi process)

If you prefer to seed from another Node process or your app code:
1) Create an Admin/API token in Strapi.
2) Use REST endpoints to POST content.
3) Upload media via `/upload` first; reference returned file IDs in content.

Pros: No need to boot Strapi inside the seeder. Cons: Slightly more boilerplate and HTTP overhead.

---

## Option E — Database Migrations (versioned, repeatable)

Use migrations to ship schema/data changes alongside code, with idempotent logic.

Docs: https://docs.strapi.io/cms/database-migrations

Example pattern inside a migration file:

```ts
// Example snippet inside a migration
module.exports = {
  async up() {
    await strapi.db.transaction(async () => {
      // create/update using entityService
      await strapi.entityService.create('api::article.article', {
        data: { title: 'Hello from migration' },
      });
    });
  },
};
```

---

## Practical recommendation for this repo

- You already have `scripts/seed.js`. For Zod/TS mocks, add a TypeScript seeder (`scripts/seed.ts`) and either transpile or run via `ts-node`.
- Add `pnpm run seed:mock` to `package.json` scripts. Example:

```json
{
  "scripts": {
    "seed:mock": "ts-node --transpile-only scripts/seed.ts"
  }
}
```

- If you also want a shareable dataset for teammates/CI: after seeding locally once, run Export CLI, commit the `.tar` to an artifact store, and use Import CLI in CI/bootstrap.

---

## Gotchas and tips

- Ensure Strapi is running with the same env/database you intend to populate.
- For relations, resolve IDs up front (query by unique field, then attach the ID).
- Validate with Zod first; log a compact diff when validation fails to speed up fixes.
- For large media sets, stream from disk and upload in batches; throttle concurrency.
- Use `--force` wisely when running CLI import/transfer in CI to avoid prompts.

---

## Commands cheat sheet

```bash
# Script seeding (local)
pnpm run seed:mock

# Export (to create importable archive)
strapi export --file ./exports/snapshot.tar --no-compress --no-encryption

# Import (from archive)
strapi import --file ./exports/snapshot.tar --force

# Transfer (between environments)
strapi transfer --to https://dest-url --to-token "$TRANSFER_TOKEN" --force
```
