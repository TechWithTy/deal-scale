# Database strategy: SQLite for local, Postgres for production (Strapi v5)

This project is configured to run with SQLite locally for fast setup, and Postgres in production for scalability.

- Config file: `config/database.ts` reads `DATABASE_CLIENT` and other envs.
- Example envs are provided in `./.env.example`.

## Local development (SQLite)

1) Ensure your `.env` has:
```
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

2) Install the SQLite driver (runtime dependency):
```
pnpm add better-sqlite3
```

3) Run Strapi:
```
pnpm dev
```

Notes:
- On Windows/macOS, `better-sqlite3` uses prebuilt binaries; if build is required, install platform build tools.

## Production (Postgres)

Use Postgres in production (managed DB or self-hosted). Example env:
```
DATABASE_CLIENT=postgres
DATABASE_HOST=your-host
DATABASE_PORT=5432
DATABASE_NAME=your-db
DATABASE_USERNAME=your-user
DATABASE_PASSWORD=your-pass
DATABASE_SSL=true
```
Alternatively, provide a single URL:
```
DATABASE_URL=postgres://user:pass@host:5432/db
```

Migrations & bootstrapping:
- Use Strapi migrations for schema/data changes committed to git.
- Use Import/Transfer CLI to move datasets between envs when needed.

## Docker examples

Local Postgres (optional):
```
docker run --name strapi-pg \
  -e POSTGRES_USER=strapi \
  -e POSTGRES_PASSWORD=strapi \
  -e POSTGRES_DB=dealscale \
  -p 5432:5432 -d postgres:16
```

Compose snippet:
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: ${DATABASE_NAME}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

## Quick verify
- Local: `pnpm dev` should start without connecting to 5432.
- Prod: App connects to Postgres; confirm network/SSL settings.
