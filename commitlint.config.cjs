const fs = require('node:fs');
const path = require('node:path');

const staticScopes = [
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

function loadDynamicScopes() {
  try {
    const p = path.join(__dirname, 'commitlint.scopes.json');
    if (!fs.existsSync(p)) return [];
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (Array.isArray(data)) return data.filter(Boolean);
  } catch {}
  return [];
}

const allScopes = Array.from(new Set([...staticScopes, ...loadDynamicScopes()])).sort();

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "scope-enum": [2, "always", allScopes],
    "subject-case": [0],
    "subject-full-stop": [2, "never"],
    "header-max-length": [2, "always", 88],
  },
};









