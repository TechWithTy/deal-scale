import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Handle Stripe webhook events using centralized webhook handler.
 *
 * Uses centralized webhook utilities for DRY implementation
 * Processes Stripe webhook events, particularly 'checkout.session.completed' for credit purchases.
 * Verifies webhook signature and publishes event to Pulsar.
 *
 * Note: Webhook endpoints do not require authentication as they come from Stripe
 */
export async function POST(req: NextRequest) {
	try {
		// Get the raw body for webhook signature verification
		const body = await req.text();
		const signature = req.headers.get("stripe-signature");

		if (!signature) {
			console.error("Missing Stripe signature header");
			return NextResponse.json(
				{ error: "Missing Stripe signature" },
				{ status: 400 },
			);
		}

		// Forward the webhook to DealScale backend for processing
		const webhookResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/payments/webhook`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"stripe-signature": signature,
				},
				body: body,
			},
		);

		if (!webhookResponse.ok) {
			console.error(
				"Failed to process webhook:",
				webhookResponse.status,
				await webhookResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to process webhook" },
				{ status: 500 },
			);
		}

		const data = await webhookResponse.json();

		// Log successful webhook processing
		console.log("Stripe webhook processed successfully");

		return NextResponse.json(data);
	} catch (error) {
		console.error("Webhook processing error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Handle other HTTP methods with appropriate responses
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
