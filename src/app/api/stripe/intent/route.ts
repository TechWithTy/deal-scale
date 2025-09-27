import { mockDiscountCodes } from "@/data/discount/mockDiscountCodes";
import {
	createPaymentIntent,
	deletePaymentIntent,
	retrievePaymentIntent,
	updatePaymentIntent,
} from "@/lib/externalRequests/stripe";
import type { PricingCategoryValue } from "@/types/service/plans";
import { validateDiscountCode } from "@/utils/discountValidator";
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

export async function PUT(req: NextRequest) {
	try {
		const { intentId, discountCode: codeToValidate } = await req.json();

		if (!intentId) {
			return NextResponse.json(
				{ error: "Payment Intent ID is required" },
				{ status: 400 },
			);
		}

		// 1. Retrieve the existing payment intent to get its current state from Stripe
		const existingIntent = await retrievePaymentIntent(intentId);
		if (!existingIntent) {
			return NextResponse.json(
				{ error: "Payment Intent not found" },
				{ status: 404 },
			);
		}

		const originalPrice = existingIntent.amount;
		const metadata = existingIntent.metadata;
		let finalPrice = originalPrice;

		// 2. If a discount code is provided, validate it and recalculate the price
		if (codeToValidate) {
			const discountCode = mockDiscountCodes.find(
				(dc) => dc.code === codeToValidate,
			);

			if (!discountCode) {
				return NextResponse.json(
					{ error: "Invalid discount code" },
					{ status: 400 },
				);
			}

			// Use the retrieved metadata for validation, casting the category ID to its specific type
			if (!metadata?.planId || !metadata?.pricingCategoryId) {
				return NextResponse.json(
					{
						error:
							"Cannot validate discount. Plan information is missing from the payment intent.",
					},
					{ status: 400 },
				);
			}
			const validationResult = validateDiscountCode(discountCode, {
				planId: metadata?.planId,
				planCategoryId: metadata?.pricingCategoryId as PricingCategoryValue,
			});

			if (!validationResult.isValid) {
				return NextResponse.json(
					{ error: validationResult.errorMessage },
					{ status: 400 },
				);
			}

			// Recalculate price based on the original amount from the retrieved intent
			if (discountCode.discountPercent) {
				finalPrice = originalPrice * (1 - discountCode.discountPercent / 100);
			} else if (discountCode.discountAmount) {
				finalPrice = originalPrice - discountCode.discountAmount * 100; // Convert dollar amount to cents
			}
			finalPrice = Math.max(0, finalPrice); // Ensure price is not negative
		}

		// 3. Update the payment intent with the final, validated price
		const intent = await updatePaymentIntent({
			intentId,
			price: Math.round(finalPrice),
			metadata, // ! Pass existing metadata back to ensure it's not lost
		});

		const response = NextResponse.json(intent);
		response.cookies.set("intentId", intent.id as string);
		return response;
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "An unknown error occurred",
			},
			{ status: 500 },
		);
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
		const intent = await retrievePaymentIntent(intentId);
		if (!intent || intent.status === "canceled") {
			return NextResponse.json(
				{ error: "Payment intent not found or canceled" },
				{ status: 400 },
			);
		}
		return NextResponse.json(intent);
	} catch (error) {
		console.error("Error retrieving payment intent:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
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
		const intent = await deletePaymentIntent(intentId);
		return NextResponse.json(intent);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
