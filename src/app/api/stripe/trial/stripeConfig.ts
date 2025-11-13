import type Stripe from "stripe";

const FALLBACK_API_VERSION = "2023-10-16";

const normalizeApiVersion = (
	value: string | undefined,
): Stripe.LatestApiVersion | string => {
	const trimmed = value?.trim();
	if (!trimmed) {
		return FALLBACK_API_VERSION;
	}
	return trimmed;
};

export const STRIPE_API_VERSION = normalizeApiVersion(
	process.env.STRIPE_API_VERSION,
);

export const buildStripeConfig = (): Stripe.StripeConfig => {
	if (STRIPE_API_VERSION === FALLBACK_API_VERSION) {
		return {};
	}

	return {
		apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion,
	};
};