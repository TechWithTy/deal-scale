import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buildStripeConfig } from "./stripeConfig";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: Request) {
	if (!stripeSecretKey) {
		return NextResponse.json(
			{ error: "Stripe secret key is not configured." },
			{ status: 500 },
		);
	}

	try {
		const stripe = new Stripe(stripeSecretKey, buildStripeConfig());

		const {
			planId = "basic",
			planName = "Basic",
			planPrice,
		} = (await request.json().catch(() => ({}))) ?? {};

		const metadata: Record<string, string> = {
			trial: "true",
			planId: String(planId),
			planName: String(planName),
		};

		if (planPrice !== undefined && planPrice !== null) {
			metadata.postTrialPrice = String(planPrice);
		}

		const setupIntent = await stripe.setupIntents.create({
			payment_method_types: ["card"],
			usage: "off_session",
			metadata,
		});

		return NextResponse.json({
			clientSecret: setupIntent.client_secret,
		});
	} catch (error) {
		console.error("Failed to create trial setup intent:", error);
		const message =
			error instanceof Error
				? error.message
				: "Unable to initialize free trial checkout.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
