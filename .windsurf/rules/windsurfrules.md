---
trigger: always_on
---

- (Context) Look into \_docs folder in the directory to get an idea of the bet pratices for app or libary were using

Biome Usage (Frontend Linting/Formatting)
Use Biome as the default linter and code formatter for all TypeScript/JavaScript/React files.
All code must pass Biome lint and format checks before commit.
Use the following commands:
pnpm biome check . — Run Biome lint on the entire project.
pnpm biome format . — Auto-format codebase.
Prefer import type { X } from '...' or import { type X } from '...' for type-only imports, as enforced by Biome.
Configure Biome to enforce strict type imports, no any/unknown, and modern TS/React best practices.
Integrate Biome with your CI pipeline to block merges on lint/format errors.
Do not use template literals if interpolation and special-character handling are not needed.biome
This let declares a variable that is only assigned once.biomelint/style/useConst
user.ts(25, 9):
Avoid using the index of an array as key property in an element.biomelint/suspicious/noArrayIndexKey
main.tsx(216, 29):
Provide an explicit type prop for the button element.biomelint/a11y/useButtonType

For custom rules, edit .biomerc.json at the project root.
