import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const stripeCtorMock = vi.fn().mockImplementation(() => ({
	paymentIntents: {
		create: vi.fn().mockResolvedValue({ id: "pi_123" }),
		update: vi.fn().mockResolvedValue({ id: "pi_123" }),
		retrieve: vi.fn().mockResolvedValue({ id: "pi_123" }),
	},
	webhooks: {
		constructEvent: vi.fn().mockReturnValue({ id: "evt_123" }),
	},
	subscriptions: {
		create: vi.fn().mockResolvedValue({ id: "sub_123", latest_invoice: { id: "in_123" }, status: "active" }),
		update: vi.fn().mockResolvedValue({ id: "sub_123", status: "active", latest_invoice: "in_123" }),
		del: vi.fn().mockResolvedValue({ id: "sub_123" }),
		cancel: vi.fn().mockResolvedValue({ id: "sub_123" }),
	},
	invoices: {
		pay: vi.fn().mockResolvedValue({ status: "paid" }),
	},
}));

vi.mock("stripe", () => ({
	__esModule: true,
	default: stripeCtorMock,
}));

let stripeModule: typeof import("@/lib/externalRequests/stripe");

const setEnv = (envVars: Record<string, string | undefined>) => {
	for (const [key, value] of Object.entries(envVars)) {
		if (value === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = value;
		}
	}
};

const originalWindow = globalThis.window;

beforeAll(async () => {
	stripeModule = await import("@/lib/externalRequests/stripe");
	if (typeof originalWindow !== "undefined") {
		vi.stubGlobal("window", undefined);
	}
});

describe("Stripe integration", () => {
	const originalEnv = { ...process.env };
	const originalStagingEnv = process.env.STAGING_ENVIRONMENT;

	beforeEach(() => {
		process.env = { ...originalEnv } as NodeJS.ProcessEnv;
		setEnv({
			STRIPE_SECRET_KEY: "sk_test_123",
			STRIPE_SECRET_LIVE_KEY: "sk_live_123",
			NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_123",
			STRIPE_WEB_SECRET: "whsec_123",
		});
		process.env.STAGING_ENVIRONMENT = "DEVELOPMENT";

		stripeModule.resetStripeClientForTest();
		stripeCtorMock.mockClear();
	});

	afterAll(() => {
		process.env = originalEnv as NodeJS.ProcessEnv;
		if (originalStagingEnv !== undefined) {
			process.env.STAGING_ENVIRONMENT = originalStagingEnv;
		}
		if (typeof originalWindow !== "undefined") {
			vi.stubGlobal("window", originalWindow);
		}
	});

	describe("Environment-specific behavior", () => {
		it("uses test key in non-production environment", () => {
			process.env.STAGING_ENVIRONMENT = "DEVELOPMENT";

			setEnv({
				STRIPE_SECRET_KEY: "sk_test_env",
				STRIPE_SECRET_LIVE_KEY: "sk_live_env",
			});

			stripeModule.resetStripeClientForTest();
			const client = stripeModule.getStripeClient();

			expect(client).toBeDefined();
			expect(process.env.STRIPE_SECRET_KEY).toBe("sk_test_env");
		});

		it("uses live key in production environment", () => {
			process.env.STAGING_ENVIRONMENT = "PRODUCTION";

			setEnv({
				STRIPE_SECRET_KEY: "sk_test_env",
				STRIPE_SECRET_LIVE_KEY: "sk_live_env",
			});

			stripeModule.resetStripeClientForTest();
			const client = stripeModule.getStripeClient();

			expect(client).toBeDefined();
			expect(process.env.STRIPE_SECRET_LIVE_KEY).toBe("sk_live_env");
		});

		it("falls back to test key if live key is not available in production", () => {
			process.env.STAGING_ENVIRONMENT = "PRODUCTION";

			setEnv({
				STRIPE_SECRET_KEY: "sk_test_env",
				STRIPE_SECRET_LIVE_KEY: "",
			});

			stripeModule.resetStripeClientForTest();
			const client = stripeModule.getStripeClient();

			expect(client).toBeDefined();
			expect(process.env.STRIPE_SECRET_KEY).toBe("sk_test_env");
		});

		it("throws error if no keys are available", () => {
			process.env.STAGING_ENVIRONMENT = "PRODUCTION";

			setEnv({
				STRIPE_SECRET_KEY: "",
				STRIPE_SECRET_LIVE_KEY: "",
			});

			stripeModule.resetStripeClientForTest();

			expect(() => stripeModule.getStripeClient()).toThrow(
				"STRIPE_SECRET_LIVE_KEY (or STRIPE_SECRET_KEY) is not set in environment variables",
			);
		});
	});

	it("creates a payment intent", async () => {
		const res = await stripeModule.createPaymentIntent({
			price: 1000,
			description: "desc",
		});
		expect(res).toHaveProperty("id", "pi_123");
	});

	it("updates a payment intent", async () => {
		const res = await stripeModule.updatePaymentIntent({
			price: 1000,
			intentId: "pi_123",
		});
		expect(res).toHaveProperty("id", "pi_123");
	});

	it("verifies webhook", async () => {
		const res = await stripeModule.verifyWebhook("sig", "body");
		expect(res).toHaveProperty("id", "evt_123");
	});
});
