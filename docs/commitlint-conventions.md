## Commit Message Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org) with a frontend-oriented twist to keep history clean and release automation friendly.

The required format is:

```
<type>(<scope>): <subject>
```

- **type** — see table below; must be one of the whitelisted values.
- **scope** — picks the area affected (also whitelisted).
- **subject** — short description (`≤ 88` chars), written in natural case (no trailing period).

### Allowed Types

| Type      | Use When                                                             |
|-----------|----------------------------------------------------------------------|
| feat      | shipping a new feature                                               |
| fix       | bug fix                                                              |
| docs      | documentation updates                                                |
| style     | CSS/Tailwind/formatting only                                         |
| refactor  | code refactor without functional change                              |
| perf      | performance improvements                                             |
| test      | adding or updating tests                                             |
| build     | build tooling (Next/Vite/Rspack)                                      |
| ci        | CI/CD configuration changes                                          |
| chore     | maintenance (deps, cleanup, scripts)                                 |
| revert    | explicit revert of a previous commit                                 |

### Allowed Scopes

| Scope   | Area                                                                 |
|---------|----------------------------------------------------------------------|
| ui      | UI components                                                        |
| ux      | user-experience tweaks                                               |
| layout  | layout or grid structure                                             |
| page    | Next.js page routes                                                  |
| api     | API routes/functions                                                 |
| hooks   | React hooks                                                          |
| state   | state management (Zustand/Context/etc.)                               |
| assets  | images, icons, fonts                                                 |
| config  | environment or project configuration                                 |
| deps    | dependency updates                                                   |
| styles  | Tailwind/CSS tokens                                                  |
| tests   | automated tests                                                      |
| docs    | documentation                                                        |
| core    | shared utilities, core logic                                         |

### Examples

- `feat(ui): add dynamic marquee hero component`
- `fix(state): resolve flicker on hydration`
- `style(styles): update dark mode palette`
- `docs(ui): document Button variants`
- `ci(config): add pre-push build validation`

### Tooling

- `commitlint.config.cjs` extends `@commitlint/config-conventional` with the above enums.
- Husky’s `commit-msg` hook runs `npx --no-install commitlint --edit "$1"` so invalid commits are blocked before they land.






