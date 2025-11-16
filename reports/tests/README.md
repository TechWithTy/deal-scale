# Test Coverage Archive

Running `pnpm run test:coverage` (executed automatically by the Husky pre-commit hook) creates a standard Vitest coverage report inside the `coverage/` directory. The archive script copies that directory to:

```
reports/tests/history/<yyyy-mm-dd>/coverage-<timestamp>/
```

Each timestamp uses an ISO-like format (e.g. `coverage-2025-11-14T03-42-11`) so you can associate the coverage snapshot with the commit that generated it. The archive script stages the new directory automatically, so you just need to review and commit as usual.

If you want to run the coverage workflow manually, use:

```
pnpm run test:coverage
pnpm run archive:coverage
```







