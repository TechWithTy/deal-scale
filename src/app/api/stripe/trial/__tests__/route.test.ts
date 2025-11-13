/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from "vitest";
import { STRIPE_API_VERSION, buildStripeConfig } from "../stripeConfig";

describe("Stripe trial API config", () => {
	it("uses the current Stripe API version", () => {
		expect(STRIPE_API_VERSION).toBe("2023-10-16");
		expect(buildStripeConfig()).toEqual({});
	});

	it("applies apiVersion when configured via env", async () => {
		const original = process.env.STRIPE_API_VERSION;
		process.env.STRIPE_API_VERSION = "2025-05-28.basil";

		vi.resetModules();

		const { STRIPE_API_VERSION: envVersion, buildStripeConfig: buildConfig } =
			await import("../stripeConfig");

		expect(envVersion).toBe("2025-05-28.basil");
		expect(buildConfig()).toEqual({ apiVersion: "2025-05-28.basil" });

		process.env.STRIPE_API_VERSION = original;
		vi.resetModules();
	});
});

