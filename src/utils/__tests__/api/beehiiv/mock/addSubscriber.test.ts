import { act, renderHook } from "@testing-library/react";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import { useNewsletterSubscribers } from "@/hooks/beehiiv/use-news-letter-subscribers";
import type { Subscriber } from "@/types/behiiv";

/**
 * Tests for adding a Beehiiv newsletter subscriber via the useNewsletterSubscribers hook.
 * All network calls are mocked. No real API requests are made.
 */
describe("Beehiiv addSubscriber", () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("successfully adds a subscriber", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: true,
			json: async () => ({
				id: "mock_subscriber_id",
				email: "test@example.com",
				status: "active",
				created: 1_747_528_542,
				subscription_tier: "free",
				subscription_premium_tier_names: [],
				utm_source: "",
				utm_medium: "",
				utm_channel: "",
				utm_campaign: "",
				referring_site: "",
				referral_code: "",
				stripe_customer_id: "",
			}),
		});

		const { result } = renderHook(() => useNewsletterSubscribers());
		let subscriber: Subscriber | null = null;

		await act(async () => {
			subscriber = await result.current.addSubscriber("test@example.com");
		});

		expect(subscriber).not.toBeNull();
		expect(subscriber).toMatchObject({
			email: "test@example.com",
			status: "active",
		});
		expect(result.current.error).toBeNull();
		expect(global.fetch).toHaveBeenCalledWith(
			"/api/beehiiv/subscribe",
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: "test@example.com" }),
			}),
		);
	});

	it("handles API error response", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
			ok: false,
			json: async () => ({ message: "Already subscribed" }),
		});

		const { result } = renderHook(() => useNewsletterSubscribers());
		let subscriber: Subscriber | null = null;

		await act(async () => {
			subscriber = await result.current.addSubscriber("fail@example.com");
		});

		expect(subscriber).toBeNull();
		expect(result.current.error).toBe("Already subscribed");
	});

	it("handles network error", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		const { result } = renderHook(() => useNewsletterSubscribers());
		let subscriber: Subscriber | null = null;

		await act(async () => {
			subscriber = await result.current.addSubscriber("fail2@example.com");
		});

		expect(subscriber).toBeNull();
		expect(result.current.error).toBe("Network error");
	});
});
