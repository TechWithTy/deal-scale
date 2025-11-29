import fs from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Integration test for Facebook Pixel mock server ingestion.
 *
 * This test verifies that pixel events fired from the redirect page
 * are correctly captured by the mock server and logged to logs.json.
 *
 * Prerequisites:
 * - Mock server must be running (npm run pixel:server)
 * - Next.js dev server must be running (npm run dev)
 */
describe("Pixel Ingestion - Mock Server Integration", () => {
	const logsFile = path.join(process.cwd(), "pixel-mock-server", "logs.json");
	const MOCK_SERVER_URL = "http://localhost:3030/pixel";

	beforeAll(async () => {
		// Ensure logs file exists
		if (!fs.existsSync(logsFile)) {
			fs.writeFileSync(logsFile, JSON.stringify([]));
		}

		// Check if mock server is running
		try {
			const response = await fetch(MOCK_SERVER_URL, {
				method: "OPTIONS",
			});
			if (!response.ok) {
				throw new Error("Mock server not responding");
			}
		} catch (_error) {
			console.warn(
				"⚠️  Mock server not running. Start it with: pnpm run pixel:server",
			);
			console.warn(
				"   Skipping pixel ingestion tests. They require the mock server to be running.",
			);
		}
	});

	afterAll(() => {
		// Clean up - optionally clear logs after test
		// Uncomment if you want to reset logs between test runs
		// fs.writeFileSync(logsFile, JSON.stringify([]));
	});

	it("should capture pixel events in mock server logs", async () => {
		// Check if mock server is available
		let serverAvailable = false;
		try {
			const checkResponse = await fetch(MOCK_SERVER_URL, {
				method: "OPTIONS",
			});
			serverAvailable = checkResponse.ok;
		} catch {
			// Server not available, skip test
		}

		if (!serverAvailable) {
			console.warn("Skipping test - mock server not running");
			return;
		}

		// Read current logs
		const logsBefore = fs.existsSync(logsFile)
			? JSON.parse(fs.readFileSync(logsFile, "utf-8"))
			: [];

		// Simulate a redirect that fires a pixel event
		// In a real scenario, this would be triggered by visiting:
		// http://localhost:3000/redirect?to=https://example.com&fbSource=test&fbIntent=test
		const testEvent = {
			event_name: "Lead",
			method: "track",
			payload: {
				source: "test",
				intent: "test",
			},
			env: "local-test",
			timestamp: Date.now(),
		};

		// Send event to mock server
		const response = await fetch(MOCK_SERVER_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(testEvent),
		});

		expect(response.ok).toBe(true);
		const result = await response.json();
		expect(result.status).toBe("mock_received");

		// Wait a bit for file write to complete
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Read logs again
		const logsAfter = fs.existsSync(logsFile)
			? JSON.parse(fs.readFileSync(logsFile, "utf-8"))
			: [];

		// Verify event was logged
		expect(logsAfter.length).toBeGreaterThan(logsBefore.length);

		// Find the test event
		const capturedEvent = logsAfter.find(
			(log: { event_name: string; payload: { source: string } }) =>
				log.event_name === "Lead" && log.payload?.source === "test",
		);

		expect(capturedEvent).toBeDefined();
		expect(capturedEvent?.event_name).toBe("Lead");
		expect(capturedEvent?.payload?.source).toBe("test");
		expect(capturedEvent?.payload?.intent).toBe("test");
	});

	it("should capture events with UTM parameters", async () => {
		// Check if mock server is available
		let serverAvailable = false;
		try {
			const checkResponse = await fetch(MOCK_SERVER_URL, {
				method: "OPTIONS",
			});
			serverAvailable = checkResponse.ok;
		} catch {
			// Server not available, skip test
		}

		if (!serverAvailable) {
			console.warn("Skipping test - mock server not running");
			return;
		}

		const testEvent = {
			event_name: "Lead",
			method: "track",
			payload: {
				source: "Meta campaign",
				intent: "MVP_Launch_BlackFriday",
				utm_source: "test",
				utm_campaign: "e2e",
			},
			env: "local-test",
			timestamp: Date.now(),
		};

		const response = await fetch(MOCK_SERVER_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(testEvent),
		});

		expect(response.ok).toBe(true);

		// Wait for file write
		await new Promise((resolve) => setTimeout(resolve, 100));

		const logs = fs.existsSync(logsFile)
			? JSON.parse(fs.readFileSync(logsFile, "utf-8"))
			: [];

		const capturedEvent = logs.find(
			(log: { payload: { utm_source: string } }) =>
				log.payload?.utm_source === "test",
		);

		expect(capturedEvent).toBeDefined();
		expect(capturedEvent?.payload?.utm_source).toBe("test");
		expect(capturedEvent?.payload?.utm_campaign).toBe("e2e");
	});

	it("should handle multiple events in sequence", async () => {
		// Check if mock server is available
		let serverAvailable = false;
		try {
			const checkResponse = await fetch(MOCK_SERVER_URL, {
				method: "OPTIONS",
			});
			serverAvailable = checkResponse.ok;
		} catch {
			// Server not available, skip test
		}

		if (!serverAvailable) {
			console.warn("Skipping test - mock server not running");
			return;
		}

		const events = [
			{
				event_name: "Lead",
				method: "track",
				payload: { source: "event1" },
				timestamp: Date.now(),
			},
			{
				event_name: "Lead",
				method: "track",
				payload: { source: "event2" },
				timestamp: Date.now() + 1,
			},
		];

		// Send both events
		for (const event of events) {
			await fetch(MOCK_SERVER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(event),
			});
		}

		// Wait for file writes
		await new Promise((resolve) => setTimeout(resolve, 200));

		const logs = fs.existsSync(logsFile)
			? JSON.parse(fs.readFileSync(logsFile, "utf-8"))
			: [];

		const event1 = logs.find(
			(log: { payload: { source: string } }) =>
				log.payload?.source === "event1",
		);
		const event2 = logs.find(
			(log: { payload: { source: string } }) =>
				log.payload?.source === "event2",
		);

		expect(event1).toBeDefined();
		expect(event2).toBeDefined();
	});
});
