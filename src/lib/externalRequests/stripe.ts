import Stripe from "stripe";
import { updatePaymentStatus } from "./sendgrid";

let client: Stripe | null = null;

export function getStripeClient(): Stripe {
	if (!client) {
		const isProduction = process.env.STAGING_ENVIRONMENT === "PRODUCTION";
		const STRIPE_SECRET_KEY = isProduction
			? process.env.STRIPE_SECRET_LIVE_KEY || process.env.STRIPE_SECRET_KEY
			: process.env.STRIPE_SECRET_KEY;
		const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

		if (typeof window === "undefined") {
			if (!STRIPE_SECRET_KEY) {
				const keyType = isProduction
					? "STRIPE_SECRET_LIVE_KEY (or STRIPE_SECRET_KEY)"
					: "STRIPE_SECRET_KEY";
				throw new Error(`${keyType} is not set in environment variables`);
			}
			if (!STRIPE_SECRET_KEY.startsWith("sk_"))
				throw new Error("Invalid Stripe secret key format");
			client = new Stripe(STRIPE_SECRET_KEY, {
				apiVersion: "2025-05-28.basil",
			});
		} else {
			if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
				throw new Error(
					"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables",
				);
			if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_"))
				throw new Error("Invalid Stripe publishable key format");
			client = new Stripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
				apiVersion: "2025-05-28.basil",
			});
		}
	}
	return client;
}

export function resetStripeClientForTest() {
	client = null;
}

const endpointSecret = process.env.STRIPE_WEB_SECRET as string;

export async function verifyWebhook(signature: string, body: string | Buffer) {
	return getStripeClient().webhooks.constructEvent(
		body,
		signature,
		endpointSecret,
	);
}

export async function createPaymentIntent({
	price,
	description,
	metadata,
}: {
	price: number;
	description: string;
	metadata?: Record<string, string | undefined | null>;
}) {
	// * Stripe metadata values must be strings. Filter out any non-string values.
	const filteredMetadata: Record<string, string> = {};
	if (metadata) {
		for (const [key, value] of Object.entries(metadata)) {
			if (typeof value === "string" && value.length > 0) {
				filteredMetadata[key] = value;
			}
		}
	}

	return getStripeClient().paymentIntents.create({
		amount: price,
		currency: "usd",
		description: description,
		metadata: filteredMetadata, // Pass the sanitized metadata
		payment_method_types: ["card", "klarna", "cashapp", "afterpay_clearpay"],
	});
}

export async function updatePaymentIntent({
	price,
	intentId,
	metadata,
}: {
	intentId: string;
	price: number;
	metadata?: Record<string, string>;
}) {
	const paymentIntent =
		await getStripeClient().paymentIntents.retrieve(intentId);
	return getStripeClient().paymentIntents.update(paymentIntent.id, {
		amount: price,
		currency: "usd",
		payment_method_types: ["card", "klarna", "cashapp", "afterpay_clearpay"],
		...(metadata ? { metadata } : {}),
	});
}

export async function retrievePaymentIntent(intentId: string) {
	return getStripeClient().paymentIntents.retrieve(intentId);
}

export async function deletePaymentIntent(intentId: string) {
	return getStripeClient().paymentIntents.cancel(intentId);
}

export async function createSubscription(
	priceId: string,
	customerId: string,
	paymentMethod: string,
) {
	const stripe = getStripeClient();
	const subscription = await stripe.subscriptions.create({
		customer: customerId,
		description: "Apartment guru hosting",
		items: [{ price: priceId }],
		payment_behavior: "default_incomplete",
		payment_settings: { save_default_payment_method: "on_subscription" },
		default_payment_method: paymentMethod,
		expand: ["latest_invoice.payment_intent", "customer"],
	});
	const resp = await stripe.invoices.pay(
		(subscription.latest_invoice as Stripe.Invoice).id as string,
		{
			payment_method: paymentMethod,
		},
	);
	return { status: resp.status === "paid" ? "active" : subscription.status };
}

export async function updateSubscription(
	subscriptionId: string,
	update: { paymentMethod: string },
) {
	const stripe = getStripeClient();
	const subscription = await stripe.subscriptions.update(subscriptionId, {
		default_payment_method: update.paymentMethod,
	});

	if (
		subscription.status === "past_due" ||
		subscription.status === "unpaid" ||
		subscription.status === "incomplete"
	) {
		const resp = await stripe.invoices.pay(
			subscription.latest_invoice as string,
			{
				payment_method: update.paymentMethod,
			},
		);
		return { status: resp.status === "paid" ? "active" : subscription.status };
	}

	return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
	const stripe = getStripeClient();
	return stripe.subscriptions.cancel(subscriptionId, {
		cancellation_details: { comment: "User Unsubscribed" },
	});
}
