# Facebook Pixel Redirect Test Suite

Comprehensive test suite for validating Facebook Pixel tracking in redirect flows.

## Test Structure

```
tests/pixel-redirect/
├── unit-redirect.test.tsx    # Jest/Vitest unit tests
├── e2e-playwright.test.ts    # Playwright E2E browser tests
├── mock-fbq.ts               # Mock Facebook Pixel utility
├── playwright.config.ts      # Playwright configuration
└── README.md                 # This file
```

## What Gets Tested

### ✅ Unit Tests (Vitest)
- Pixel event firing before redirect
- Custom event parameters (source, intent)
- Redirect timing validation (>500ms delay)
- UTM parameter preservation
- Error handling and edge cases

### ✅ E2E Tests (Playwright)
- Real browser behavior validation
- Timing verification in full runtime
- Event firing order confirmation
- Navigation behavior

## Running Tests

### Unit Tests

```bash
# Run all pixel redirect unit tests
npm test -- tests/pixel-redirect/unit-redirect.test.tsx

# Run with coverage
npm run test:coverage -- tests/pixel-redirect/
```

### E2E Tests (Playwright)

**First-time setup:**
```bash
# Install Playwright
npm install -D @playwright/test

# Install browser binaries
npx playwright install
```

**Run E2E tests:**
```bash
# Run all E2E tests
npx playwright test tests/pixel-redirect/e2e-playwright.test.ts

# Run in headed mode (see browser)
npx playwright test tests/pixel-redirect/e2e-playwright.test.ts --headed

# Run specific browser
npx playwright test tests/pixel-redirect/e2e-playwright.test.ts --project=chromium
```

## Test Coverage

### Unit Test Coverage

| Test Case | Status |
|-----------|--------|
| Fires Lead event before redirect | ✅ |
| Uses default values when params missing | ✅ |
| Preserves UTM parameters | ✅ |
| Waits >= 500ms before redirect | ✅ |
| Handles relative paths | ✅ |
| Handles missing 'to' parameter | ✅ |
| Handles fbq not initialized | ✅ |
| Handles pixel errors gracefully | ✅ |
| Cleans up timer on unmount | ✅ |
| Fires with correct custom parameters | ✅ |

### E2E Test Coverage

| Test Case | Status |
|-----------|--------|
| Redirect fires pixel and navigates | ✅ |
| Timing validation (>=500ms) | ✅ |
| UTM parameter preservation | ✅ |
| Missing parameter handling | ✅ |
| Pixel fires before navigation | ✅ |

## CI Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run Pixel Redirect Tests
  run: |
    npm test -- tests/pixel-redirect/unit-redirect.test.tsx
    npx playwright test tests/pixel-redirect/e2e-playwright.test.ts
```

## Manual Testing Checklist

For manual validation in Meta Events Manager:

1. ✅ Set up test environment with real Facebook Pixel ID
2. ✅ Visit redirect URL: `/redirect?to=https://example.com&fbSource=test&fbIntent=manual`
3. ✅ Check Meta Events Manager → Test Events
4. ✅ Verify "Lead" event appears with correct parameters
5. ✅ Verify redirect happens after pixel fires

## Troubleshooting

### Unit tests failing
- Ensure `vitest.setup.ts` is configured correctly
- Check that `window.fbq` mock is properly set up
- Verify Next.js navigation mocks are working

### E2E tests failing
- Ensure dev server is running: `npm run dev`
- Check Playwright browser installation: `npx playwright install`
- Verify base URL in `playwright.config.ts` matches your dev server

### Pixel events not appearing in Meta
- Verify `DEAL_SCALE_FB_Pixel_ID` environment variable is set
- Check browser console for pixel initialization errors
- Ensure pixel script is loaded before redirect page

## Next Steps

- [ ] Add CI integration (GitHub Actions)
- [ ] Create mock FB Pixel ingestion server for testing
- [ ] Add auto-fire booking conversion tests
- [ ] Add performance benchmarks for redirect timing

