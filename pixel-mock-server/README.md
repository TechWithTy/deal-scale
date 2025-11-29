# Facebook Pixel Mock Server

A local mock server for capturing and logging Facebook Pixel events during development and testing.

## Overview

This mock server intercepts Facebook Pixel events and logs them to `logs.json` instead of sending them to Facebook's servers. This allows you to:

- ✅ Test pixel events locally without affecting production data
- ✅ Verify events are fired before redirects
- ✅ Debug event payloads and timing
- ✅ Run CI tests that validate pixel tracking

## Usage

### Start the Mock Server

```bash
pnpm run pixel:server
```

The server will start on `http://localhost:3030/pixel` and log all captured events to `logs.json`.

### Development Mode

To run the Next.js dev server with the mock server:

```bash
pnpm run dev:with-pixel
```

This starts both the mock server and the Next.js dev server in parallel.

### Testing

Run the integration tests:

```bash
# Start mock server in background, then run tests
pnpm run pixel:test

# Or manually:
pnpm run pixel:server &
pnpm test tests/pixel-ingestion.test.ts
```

## How It Works

1. **In Development**: The `fbq-mock.ts` utility automatically replaces `window.fbq` with a mock function that sends events to the local mock server.

2. **Event Capture**: When a pixel event is fired (e.g., `fbq('track', 'Lead', {...})`), it's sent to `http://localhost:3030/pixel` via POST.

3. **Logging**: The mock server receives the event, logs it to `logs.json`, and returns a success response.

4. **In Production**: The real Facebook Pixel is used (mock is disabled).

## Event Format

Events are logged with the following structure:

```json
{
  "timestamp": 1234567890,
  "event_name": "Lead",
  "method": "track",
  "payload": {
    "source": "Meta campaign",
    "intent": "MVP_Launch_BlackFriday"
  },
  "env": "local-test"
}
```

## Viewing Logs

```bash
# View all captured events
cat pixel-mock-server/logs.json | jq

# View last event
cat pixel-mock-server/logs.json | jq '.[-1]'

# Count events
cat pixel-mock-server/logs.json | jq 'length'
```

## Integration with Redirects

The redirect page (`src/app/redirect/page.tsx`) automatically initializes the mock in development mode. When Facebook Pixel tracking is enabled for a redirect:

1. The redirect page fires a `Lead` event
2. The event is captured by the mock server
3. After 600ms delay, the redirect completes
4. The event is logged to `logs.json`

## CI/CD Integration

The mock server can be used in CI pipelines to validate pixel tracking:

```yaml
# Example GitHub Actions
- name: Start mock server
  run: pnpm run pixel:server &
  
- name: Run pixel tests
  run: pnpm test tests/pixel-ingestion.test.ts
```

## Troubleshooting

### Mock server not receiving events

- Ensure the server is running: `pnpm run pixel:server`
- Check that `NODE_ENV=development` is set
- Verify `ENABLE_FBQ_MOCK=true` if you want to force mock mode

### Events not appearing in logs.json

- Check server console for errors
- Verify file permissions on `logs.json`
- Ensure the server is running on port 3030

### CORS errors

The mock server includes CORS headers for local development. If you see CORS errors, check that the server is running and accessible.

## Next Steps

- Add Lead + Schedule/BookCall event logging
- Add S3/history archiving of pixel logs
- Auto-fail CI if PageView does NOT fire before redirect
- Generate event analytics dashboard

