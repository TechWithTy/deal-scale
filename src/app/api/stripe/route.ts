import {
	createPaymentIntent,
	deletePaymentIntent,
	retrievePaymentIntent,
	updatePaymentIntent,
} from "@/lib/externalRequests/stripe";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
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

		// ! Debug: Log input
		console.log("[POST] Creating payment intent for:", {
			price,
			description,
			metadata,
		});
		const paymentIntent = await createPaymentIntent({
			price,
			description,
			metadata,
		});
		// ! Debug: Log output
		console.log("[POST] Stripe createPaymentIntent result:", paymentIntent);

		// * Return the full paymentIntent object
		return NextResponse.json({
			id: paymentIntent.id,
			clientSecret: paymentIntent.client_secret,
			amount: paymentIntent.amount,
			currency: paymentIntent.currency,
			description: paymentIntent.description,
			status: paymentIntent.status,
			metadata: paymentIntent.metadata,
			created: paymentIntent.created,
			// * Add more fields as needed for your frontend/tests
		});
	} catch (error) {
		console.error("[POST] Payment intent error:", error);
		return NextResponse.json(
			{
				error: "Failed to create payment intent",
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
				full: error,
			},
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const { price, description, metadata, intentId } = await req.json();
		// ! Debug: Log input
		console.log("[PUT] Updating payment intent:", {
			intentId,
			price,
			metadata,
		});
		const intent = await updatePaymentIntent({ intentId, price, metadata });
		// ! Debug: Log output
		console.log("[PUT] Stripe updatePaymentIntent result:", intent);
		if (!intent || intent.status === "canceled") {
			return NextResponse.json(
				{ error: "Payment intent not found or canceled" },
				{ status: 400 },
			);
		}
		const response = NextResponse.json({ id: intent.id, ...intent });
		response.cookies.set("intentId", intent.id as string);
		return response;
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		// Prefer intentId from query param, fallback to cookie
		const { searchParams } = new URL(req.url);
		let intentId = searchParams.get("intentId");
		if (!intentId) {
			const cookieStore = await cookies();
			intentId = (await cookieStore).get("intentId")?.value;
		}
		if (!intentId) {
			return NextResponse.json(
				{ error: "intentId is required" },
				{ status: 400 },
			);
		}
		// ! Debug: Log input
		console.log("[GET] Retrieving payment intent:", { intentId });
		const intent = await retrievePaymentIntent(intentId);
		// ! Debug: Log output
		console.log("[GET] Stripe retrievePaymentIntent result:", intent);
		if (!intent || intent.status === "canceled") {
			return NextResponse.json(
				{ error: "Payment intent not found or canceled" },
				{ status: 400 },
			);
		}
		return NextResponse.json({ id: intent.id, ...intent });
	} catch (error) {
		console.error("[GET] Error retrieving payment intent:", error);
		return NextResponse.json(
			{
				error: "Failed to retrieve payment intent",
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
				full: error,
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		let intentId = searchParams.get("intentId");
		if (!intentId) {
			const cookieStore = await cookies();
			intentId = (await cookieStore).get("intentId")?.value;
		}
		if (!intentId) {
			return NextResponse.json(
				{ error: "intentId is required" },
				{ status: 400 },
			);
		}
		// ! Debug: Log input
		console.log("[DELETE] Deleting payment intent:", { intentId });
		const intent = await deletePaymentIntent(intentId);
		// ! Debug: Log output
		console.log("[DELETE] Stripe deletePaymentIntent result:", intent);
		if (!intent || intent.status === "canceled") {
			return NextResponse.json(
				{ error: "Payment intent not found or already canceled" },
				{ status: 400 },
			);
		}
		return NextResponse.json({ id: intent.id, ...intent });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
