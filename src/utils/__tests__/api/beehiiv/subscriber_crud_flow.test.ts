import { afterAll, expect } from "vitest";

import { useNewsletterSubscribers } from "@/hooks/beehiiv/use-news-letter-subscribers";
import type { Subscriber } from "@/types/behiiv";
import { act, renderHook } from "@testing-library/react";
import {
	describeIfExternal,
	skipExternalTest,
} from "../../../testHelpers/external";
process.env.API_BASE_URL = "http://localhost:3000";
/**
 * Integration test for exercising the full CRUD flow of Beehiiv subscribers.
 * This test will create a real subscriber via the API, read it, update it (if possible), delete it, and confirm deletion.
 * Only run this in a safe test environment!
 */
const LONG_TIMEOUT = 20_000;

skipExternalTest("Beehiiv CRUD flow (integration)");
describeIfExternal("Beehiiv CRUD flow (integration)", () => {
	// Use a unique test email to avoid conflicts
	const testEmail = `test-e2e+${Date.now()}@example.com`;
	let subscriberId: string | null = null;

	it(
		"performs full CRUD flow via real API",
		async () => {
		// Use the real hook and real API (no fetch mocking)
		const { result } = renderHook(() => useNewsletterSubscribers());
		let subscriber: Subscriber;
		await act(async () => {
			subscriber = await result.current.addSubscriber(testEmail);
		});
		expect(subscriber).toHaveProperty("email");
		expect(subscriber.email).toBe(testEmail);
		expect(["validating", "active"]).toContain(subscriber.status);
		expect(result.current.error).toBeNull();
		// Save subscriber ID for cleanup (if returned)
		subscriberId = subscriber?.id || null;

		// READ
		let fetchedSub: Subscriber;
		let attempts = 0;
		while (!fetchedSub && attempts < 5) {
			await act(async () => {
				fetchedSub = await result.current.getSubscriberByEmail(testEmail);
			});
			if (!fetchedSub) await new Promise((res) => setTimeout(res, 500)); // wait 0.5s
			attempts++;
		}
		expect(fetchedSub).toBeDefined();
		if (!fetchedSub) {
			throw new Error(`Subscriber not found after ${attempts} attempts`);
		}
		expect(fetchedSub).toHaveProperty("email");
		expect(fetchedSub.email).toBe(testEmail);
		expect(fetchedSub).toHaveProperty("created");
		expect(result.current.error).toBeNull();

		// UPDATE (if id present)
		if (fetchedSub?.id) {
			let updatedSub: Subscriber;
			await act(async () => {
				updatedSub = await result.current.updateSubscription(fetchedSub.id, {
					tier: "premium",
				});
			});
			expect(updatedSub).toBeTruthy();
			expect(result.current.error).toBeNull();
		}

		// DELETE
		let removed = false;
		await act(async () => {
			removed = await result.current.removeSubscriber(testEmail);
		});
		expect(removed).toBe(true);
		expect(result.current.error).toBeNull();

		// Confirm deletion
		let afterDelete: Subscriber;
		await act(async () => {
			afterDelete = await result.current.getSubscriberByEmail(testEmail);
		});
		expect(afterDelete).toBeNull();
		},
		LONG_TIMEOUT,
	);

	afterAll(async () => {
		// Clean up: Remove the test subscriber from Beehiiv using the Beehiiv API
		// Requires BEEHIIV_API_KEY and NEWSLETTER_ID set in env
		if (!subscriberId) return;
		const apiKey = process.env.BEEHIIV_API_KEY;
		const newsletterId = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
		if (!apiKey || !newsletterId) return;
		await fetch(
			`https://api.beehiiv.com/v2/publications/${newsletterId}/subscribers/${subscriberId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		);
	});
});
