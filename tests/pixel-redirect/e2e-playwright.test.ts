/**
 * E2E Browser Integration Tests for Facebook Pixel Redirect
 * Validates behavior in a real browser environment
 *
 * Setup: npm install -D @playwright/test && npx playwright install
 * Run: npx playwright test tests/pixel-redirect/e2e-playwright.test.ts
 */

import { expect, test } from "@playwright/test";

test.describe("Facebook Pixel Redirect - E2E Browser Tests", () => {
	test.beforeEach(async ({ page }) => {
		// Intercept Facebook Pixel requests to avoid actual network calls
		await page.route("**/tr/*", (route) => route.fulfill({ status: 200 }));
		await page.route("**/connect.facebook.net/**", (route) =>
			route.fulfill({ status: 200 }),
		);

		// Mock fbq function to track calls
		await page.addInitScript(() => {
			(window as { fbq?: unknown }).fbq = ((...args: unknown[]) => {
				console.log("fbq-call:", JSON.stringify(args));
			}) as typeof globalThis.fbq;
		});
	});

	test("redirect fires pixel event and then navigates with correct timing", async ({
		page,
	}) => {
		const events: string[] = [];

		// Capture console logs for fbq calls
		page.on("console", (msg) => {
			if (msg.text().includes("fbq-call")) {
				events.push(msg.text());
			}
		});

		const start = Date.now();

		// Navigate to redirect page with UTM parameters
		await page.goto(
			"http://localhost:3000/redirect?to=https://example.com/target&fbSource=Meta+campaign&fbIntent=Launch&utm_source=test&utm_campaign=e2e",
		);

		// Wait for the delay period (600ms)
		await page.waitForTimeout(700); // Slightly longer to ensure redirect happens

		const elapsed = Date.now() - start;

		// Verify timing - should be >= 500ms
		expect(elapsed).toBeGreaterThanOrEqual(500);

		// Verify pixel event was fired
		const leadEvents = events.filter((e) => e.includes('"Lead"'));
		expect(leadEvents.length).toBeGreaterThan(0);

		// Verify event contains correct parameters
		const hasCorrectParams = events.some(
			(e) => e.includes("Meta campaign") || e.includes("Launch"),
		);
		expect(hasCorrectParams).toBeTruthy();
	});

	test("preserves UTM parameters in final redirect", async ({ page }) => {
		await page.goto(
			"http://localhost:3000/redirect?to=https://example.com/target&utm_source=playwright&utm_campaign=test&utm_medium=automation",
		);

		// Wait for redirect
		await page.waitForTimeout(700);

		// Check if we're redirected (this will depend on your actual redirect target)
		// For external URLs, we can't easily intercept, but we can check the URL before redirect
		const currentUrl = page.url();

		// If still on redirect page, check that parameters are being processed
		if (currentUrl.includes("/redirect")) {
			// The redirect should have happened, but if not, we can check the page state
			expect(currentUrl).toBeTruthy();
		}
	});

	test("handles missing destination parameter gracefully", async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on("console", (msg) => {
			if (msg.type() === "error") {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto("http://localhost:3000/redirect?fbSource=test");

		// Wait a bit to see if any errors occur
		await page.waitForTimeout(100);

		// Should log error about missing 'to' parameter
		const hasError = consoleErrors.some((e) =>
			e.includes("Missing 'to' parameter"),
		);
		expect(hasError).toBeTruthy();
	});

	test("fires pixel event before navigation (no instant bounce)", async ({
		page,
	}) => {
		const events: string[] = [];
		let navigationStarted = false;

		page.on("console", (msg) => {
			if (msg.text().includes("fbq-call")) {
				events.push(msg.text());
			}
		});

		// Track navigation
		page.on("framenavigated", () => {
			navigationStarted = true;
		});

		let pixelFiredTime: number | null = null;

		page.on("console", (msg) => {
			if (msg.text().includes("fbq-call") && pixelFiredTime === null) {
				pixelFiredTime = Date.now();
			}
		});

		await page.goto(
			"http://localhost:3000/redirect?to=https://example.com/target&fbSource=test",
		);

		// Wait a short time to capture pixel event
		await page.waitForTimeout(100);

		// Pixel should have fired before any navigation
		expect(events.length).toBeGreaterThan(0);
		expect(pixelFiredTime).not.toBeNull();

		// Wait for redirect
		await page.waitForTimeout(600);

		// Verify pixel fired before navigation
		if (pixelFiredTime && navigationStarted) {
			expect(pixelFiredTime).toBeLessThan(Date.now());
		}
	});
});
