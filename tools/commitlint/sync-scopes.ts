import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// Resolve project root from tools/commitlint
const projectRoot = resolve(__dirname, "../..");

// Repo-specific roots to scan for meaningful scopes
const roots = [
  join(projectRoot, "src", "app"),
  join(projectRoot, "src", "components"),
  join(projectRoot, "src", "features"),
  join(projectRoot, "src", "lib"),
  join(projectRoot, "src", "data"),
  join(projectRoot, "src", "stores"),
  join(projectRoot, "src", "utils"),
  // Project-level areas
  join(projectRoot, "landing"),
  join(projectRoot, "functions"),
  join(projectRoot, "docs"),
  join(projectRoot, "tools"),
];

const outputPath = join(projectRoot, "commitlint.scopes.json");

const RESERVED_PREFIXES = ["_", "[", "."];
const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "coverage",
  "__tests__",
]);

const IGNORED_FILENAMES = new Set([
  "layout.tsx",
  "page.tsx",
  "not-found.tsx",
  "error.tsx",
  "global-error.tsx",
  "sitemap.ts",
  "favicon.ico",
]);

const STATIC_SCOPES = [
  // Keep core functional scopes stable
  "ui",
  "ux",
  "layout",
  "page",
  "api",
  "hooks",
  "state",
  "assets",
  "config",
  "deps",
  "styles",
  "tests",
  "docs",
  "core",
];

const MAX_DEPTH = 2;

const sanitize = (s: string) =>
  s
    .replace(/^\(|\)$/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const shouldSkipDir = (name: string) =>
  RESERVED_PREFIXES.some((p) => name.startsWith(p)) || IGNORED_DIRS.has(name);

const scopes = new Set<string>(STATIC_SCOPES);

function walk(dir: string, depth = 0, trail: string[] = []) {
  if (depth >= MAX_DEPTH) return;
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isFile() && IGNORED_FILENAMES.has(entry.name)) continue;
    if (!entry.isDirectory()) continue;
    if (shouldSkipDir(entry.name)) continue;

    const part = sanitize(entry.name);
    if (!part) continue;
    const scopeParts = [...trail, part];
    const scope = scopeParts.join("-");
    scopes.add(scope);

    const next = join(dir, entry.name);
    try {
      if (statSync(next).isDirectory()) walk(next, depth + 1, scopeParts);
    } catch {
      // ignore
    }
  }
}

for (const root of roots) walk(root);

const sorted = Array.from(scopes).sort();
writeFileSync(outputPath, JSON.stringify(sorted, null, 2));
console.log(`✅ Generated ${sorted.length} commit scopes -> ${outputPath}`);

