# Notion Integration Documentation

## Linktree Database

The linktree feature pulls data from a Notion database to dynamically generate a resource hub page.

### Fetching Database Schema

To see the current schema of your Notion Linktree database:

#### Option 1: API Endpoint (Recommended)

Visit or fetch:
```
GET /api/notion/linktree-schema
```

This returns:
- Database metadata (ID, title, timestamps)
- All properties with their types
- Select/multi-select option values
- Raw Notion API response

#### Option 2: Script

Run the schema fetching script:

```bash
pnpm tsx scripts/notion/fetchLinktreeSchema.ts
```

Or to write the schema to files:

```bash
pnpm tsx scripts/notion/fetchLinktreeSchema.ts --write
```

This will create:
- `src/utils/notion/linktreeDatabaseSchema.ts` - TypeScript type definitions
- `_docs/notion/linktree-database-schema.md` - Markdown documentation

### Required Environment Variables

```bash
NOTION_KEY=your_notion_integration_token
NOTION_REDIRECTS_ID=your_database_id
```

### Current Property Mapping

Based on `src/utils/notion/linktreeMapper.ts`, the following properties are mapped:

| Notion Property | Type | Mapped To |
|----------------|------|-----------|
| `Title` | title/rich_text | `title` |
| `Slug` | rich_text | `slug` |
| `Destination` | url/rich_text | `destination` |
| `Description` | rich_text | `description` |
| `Details` | rich_text | `details` |
| `Category` | select | `category` |
| `Pinned` | checkbox/select | `pinned` |
| `Highlighted` | checkbox/select | `highlighted` |
| `Link Tree Enabled` | checkbox/select | `linkTreeEnabled` |
| `Image` | url/rich_text/files | `imageUrl` |
| `Thumbnail` | url/rich_text/files | `thumbnailUrl` |
| `Video` | url/files | `videoUrl` |
| `Media` / `Files` / `File` | files | `files[]` |
| `Redirect To Download First File` | select | Used to override destination |

### Testing

You can test the schema fetch via:

1. **Browser/curl**: `curl http://localhost:3000/api/notion/linktree-schema`
2. **Debug endpoint**: Visit `/api/debug?notion=true` to see linktree diagnostics
3. **Script**: Run `pnpm tsx scripts/notion/fetchLinktreeSchema.ts`

