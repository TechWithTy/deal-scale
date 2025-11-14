import { createPaymentIntent } from "@/lib/externalRequests/stripe";
import { NextResponse } from "next/server";
import type stripe from "stripe";

interface PaymentIntentRequest {
	price: number;
	description: string;
	metadata?: Record<string, string>;
}

interface ErrorResponse {
	error: string;
	details?: string;
	code?: string;
}

export async function POST(request: Request) {
	try {
		const { price, description, metadata } =
			(await request.json()) as PaymentIntentRequest;

		console.log("Creating payment intent for:", { price, description });
		const paymentIntent = await createPaymentIntent({
			price,
			description,
			metadata,
		});

		return NextResponse.json({
			id: paymentIntent.id,
			clientSecret: paymentIntent.client_secret,
			amount: paymentIntent.amount,
			currency: paymentIntent.currency,
			description: paymentIntent.description,
			status: paymentIntent.status,
			metadata: paymentIntent.metadata,
			created: paymentIntent.created,
		});
	} catch (error) {
		console.error("Payment intent error:", error);

		const errorResponse: ErrorResponse = {
			error: "Failed to create payment intent",
		};

		if (typeof error === "object" && error !== null) {
			const stripeError = error as stripe.StripeRawError;
			if (stripeError.code) {
				errorResponse.details = stripeError.message;
				errorResponse.code = stripeError.code;
			} else if (error instanceof Error) {
				errorResponse.details = error.message;
			}
		}

		return NextResponse.json(errorResponse, { status: 500 });
	}
}
