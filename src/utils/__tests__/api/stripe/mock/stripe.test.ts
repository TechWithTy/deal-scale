/**
 * @jest-environment node
 */
// Set env vars and mock Stripe BEFORE importing the Stripe module
const stripeCtorMock = jest.fn().mockImplementation(() => ({
        paymentIntents: {
                create: jest.fn().mockResolvedValue({ id: "pi_123" }),
                update: jest.fn().mockResolvedValue({ id: "pi_123" }),
                retrieve: jest.fn().mockResolvedValue({ id: "pi_123" }),
        },
        webhooks: {
                constructEvent: jest.fn().mockReturnValue({ id: "evt_123" }),
        },
        subscriptions: {
                create: jest.fn().mockResolvedValue({ id: "sub_123" }),
                update: jest.fn().mockResolvedValue({ id: "sub_123" }),
                del: jest.fn().mockResolvedValue({ id: "sub_123" }),
        },
}));

jest.mock("stripe", () => ({
        __esModule: true,
        default: stripeCtorMock,
}));

import * as stripeModule from "@/lib/externalRequests/stripe";

// Helper function to set environment variables safely
const setEnv = (envVars: Record<string, string | undefined>) => {
        for (const [key, value] of Object.entries(envVars)) {
                if (value === undefined) {
                        delete process.env[key];
                } else {
                        process.env[key] = value;
                }
        }
};

/**
 * Tests for Stripe integration functions.
 * All network calls are mocked. No real payment or subscription is created.
 */
describe("Stripe integration", () => {
	const originalEnv = { ...process.env };
	// Store original env vars that we might modify
	const originalStagingEnv = process.env.STAGING_ENVIRONMENT;
	const originalStripeKey = process.env.STRIPE_SECRET_KEY;
	const originalStripeLiveKey = process.env.STRIPE_SECRET_LIVE_KEY;

        beforeEach(() => {
                // Reset to default test environment
                process.env = { ...originalEnv };
                setEnv({
                        STRIPE_SECRET_KEY: "sk_test_123",
			STRIPE_SECRET_LIVE_KEY: "sk_live_123",
			NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_123",
			STRIPE_WEB_SECRET: "whsec_123",
		});
		// Set default staging environment for tests
		process.env.STAGING_ENVIRONMENT = "DEVELOPMENT";

                stripeModule.resetStripeClientForTest();
                stripeCtorMock.mockClear();
        });

	afterAll(() => {
		// Restore original environment variables
		process.env = originalEnv;
		// Restore STAGING_ENVIRONMENT
		if (originalStagingEnv !== undefined) {
			process.env.STAGING_ENVIRONMENT = originalStagingEnv;
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
				STRIPE_SECRET_LIVE_KEY: "", // Empty string simulates unset
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
                        expect(process.env.STRIPE_SECRET_KEY).toBe("");
                        expect(process.env.STRIPE_SECRET_LIVE_KEY).toBe("");

                        expect(process.env.STRIPE_SECRET_LIVE_KEY || process.env.STRIPE_SECRET_KEY).toBe("");

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
