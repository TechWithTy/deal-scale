# Import data from a local Dealscale app (http://localhost:3000) into this Strapi project

This guide shows two official Strapi v5 ways to bring content from another local Strapi app (source at http://localhost:3000) into this project (destination, typically http://localhost:1337).

References:
- Data transfer CLI: https://docs.strapi.io/cms/data-management/transfer
- Data import CLI: https://docs.strapi.io/cms/data-management/import
- Data export CLI: https://docs.strapi.io/cms/data-management/export

## Option 1 — Data Transfer (recommended for env-to-env sync)

Use Strapi’s transfer CLI to move data directly from the source instance to this destination instance.

Assumptions:
- Source (Dealscale app) runs at: http://localhost:3000
- Destination (this repo) runs at: http://localhost:1337

Steps:

1) Start both projects
```bash
# In source project (Dealscale app)
pnpm dev   # or: npm run develop

# In this project (destination)
pnpm dev   # or: npm run develop
```

2) Create a transfer token in destination admin (this project)
- Open http://localhost:1337/admin as a super admin
- Settings → Global Settings → Transfer Tokens → Create new token
- Copy the token (keep it secret)

3) Run transfer from the SOURCE project root (Dealscale app)
```bash
# From the source project directory
npx strapi transfer \
  --to http://localhost:1337 \
  --to-token "<DESTINATION_TRANSFER_TOKEN>" \
  --force
```

Useful scopes:
```bash
# Only transfer content entries and relations (no assets)
npx strapi transfer \
  --to http://localhost:1337 \
  --to-token "<DESTINATION_TRANSFER_TOKEN>" \
  --only data,links \
  --force

# Only files (assets)
npx strapi transfer \
  --to http://localhost:1337 \
  --to-token "<DESTINATION_TRANSFER_TOKEN>" \
  --only assets \
  --force

# Exclude assets
npx strapi transfer \
  --to http://localhost:1337 \
  --to-token "<DESTINATION_TRANSFER_TOKEN>" \
  --exclude assets \
  --force
```

Notes:
- `--force` bypasses interactive prompts (useful in CI/local scripting).
- Ensure both instances target the correct databases/environments.

## Option 2 — Export from source, Import into destination (archive-based)

If you prefer a file-based workflow (or can’t run both apps simultaneously), export from the source and import into this project.

1) On the SOURCE project (Dealscale app): export data
```bash
# Run in the source project root
npx strapi export --file ./exports/dealscale-snapshot.tar --no-encryption --no-compress
```

2) Move the archive into this project (destination)
- Copy `./exports/dealscale-snapshot.tar` to this repository (e.g., `./imports/dealscale-snapshot.tar`).

3) In this project, import the archive
```bash
# Run in this project root
npx strapi import --file ./imports/dealscale-snapshot.tar --force
```

Scopes:
```bash
# Import only certain types
npx strapi import --file ./imports/dealscale-snapshot.tar --only data,assets --force

# Exclude certain types
npx strapi import --file ./imports/dealscale-snapshot.tar --exclude assets --force
```

## Troubleshooting

- "strapi is not recognized":
  - Ensure dependencies are installed in each project: `pnpm install` then retry.
  - You can also use `npx strapi ...` which uses the project-local binary.

- Auth/permissions issues:
  - For transfer, verify the destination transfer token and that you are an admin.

- Content type mismatches:
  - Schemas should be compatible between source and destination. Synchronize code/CTB changes first.

- Large archives or timeouts:
  - Try excluding assets first, then transfer/import assets separately.

## Where this fits with our seeding guideline

- Use Data Transfer or Export/Import to quickly mirror another Strapi instance.
- Use the programmatic seeding approach (see `/_docs/importing-mock-data-into-strapi.md`) for Zod/TypeScript-driven mock data when you need custom transforms or idempotent logic.
