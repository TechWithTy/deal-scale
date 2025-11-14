import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(__dirname, "../..");
const appDir = join(projectRoot, "app");
const outputPath = join(projectRoot, "commitlint.scopes.json");

const RESERVED_PREFIXES = ["_", "[", "."];
const IGNORED_SEGMENTS = new Set([
	"favicon.ico",
	"globals.css",
	"layout.tsx",
	"page.tsx",
	"not-found.tsx",
	"error.tsx",
	"global-error.tsx",
	"sitemap.ts",
]);

const STATIC_SCOPES = [
	"api",
	"dashboard",
	"dashboard-api",
	"shared",
	"landing",
	"config",
	"deps",
	"docs",
];

const MAX_DEPTH = 2;

const sanitizeSegment = (segment: string): string => {
	const cleaned = segment
		.replace(/^\(|\)$/g, "")
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/gi, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
	return cleaned;
};

const shouldSkip = (name: string) => {
	if (IGNORED_SEGMENTS.has(name)) {
		return true;
	}
	return RESERVED_PREFIXES.some((prefix) => name.startsWith(prefix));
};

const scopes = new Set<string>(STATIC_SCOPES);

const walk = (dir: string, depth = 0, trail: string[] = []) => {
	if (depth >= MAX_DEPTH) {
		return;
	}

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) {
			continue;
		}

		if (shouldSkip(entry.name)) {
			continue;
		}

		const sanitized = sanitizeSegment(entry.name);
		if (!sanitized) {
			continue;
		}

		const scopeParts = [...trail, sanitized];
		const scope = scopeParts.join("-");
		scopes.add(scope);

		const nextPath = join(dir, entry.name);
		try {
			if (statSync(nextPath).isDirectory()) {
				walk(nextPath, depth + 1, scopeParts);
			}
		} catch {
			// noop
		}
	}
};

walk(appDir);

const sortedScopes = Array.from(scopes).sort();

writeFileSync(outputPath, JSON.stringify(sortedScopes, null, 2));

console.log(
	`✅ Generated ${sortedScopes.length} commit scopes -> ${outputPath}`,
);

