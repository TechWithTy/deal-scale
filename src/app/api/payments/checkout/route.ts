import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

type CreditType = "lead" | "ai" | "skip_trace" | "custom";

interface CreateCheckoutSessionRequest {
	credits: number;
	credit_type: CreditType;
	success_url: string;
	cancel_url: string;
	metadata?: Record<string, unknown>;
}

interface CheckoutRequestBody {
	request: CreateCheckoutSessionRequest;
	required_scopes: string[];
}

interface CheckoutSessionResponse {
	session_id: string;
	session_url: string;
	public_key: string;
	amount: number;
	credits: number;
}

/**
 * Create Stripe checkout session for custom credit purchase.
 *
 * Creates a Stripe checkout session with dynamic pricing based on credit amount.
 * Returns session URL for redirect to Stripe payment page.
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: CheckoutRequestBody = await req.json();
		const { request, required_scopes } = body;

		// Validate required fields
		if (
			!request ||
			!request.credits ||
			!request.credit_type ||
			!request.success_url ||
			!request.cancel_url
		) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: credits, credit_type, success_url, and cancel_url are required",
				},
				{ status: 400 },
			);
		}

		// Validate credit_type
		const allowedCreditTypes: CreditType[] = [
			"lead",
			"ai",
			"skip_trace",
			"custom",
		];
		if (!allowedCreditTypes.includes(request.credit_type)) {
			return NextResponse.json(
				{
					error: `Invalid credit_type. Must be one of: ${allowedCreditTypes.join(", ")}`,
				},
				{ status: 400 },
			);
		}

		// Validate credits is a positive integer
		if (!Number.isInteger(request.credits) || request.credits <= 0) {
			return NextResponse.json(
				{ error: "Credits must be a positive integer" },
				{ status: 400 },
			);
		}

		// Validate URLs
		try {
			new URL(request.success_url);
			new URL(request.cancel_url);
		} catch {
			return NextResponse.json(
				{ error: "Invalid success_url or cancel_url. Must be valid URLs." },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to create checkout session
		const checkoutResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/payments/checkout`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					request: {
						credits: request.credits,
						credit_type: request.credit_type,
						success_url: request.success_url,
						cancel_url: request.cancel_url,
						metadata: request.metadata || {},
					},
					required_scopes: required_scopes || [],
				}),
			},
		);

		if (!checkoutResponse.ok) {
			console.error(
				"Failed to create checkout session:",
				checkoutResponse.status,
				await checkoutResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to create checkout session" },
				{ status: 500 },
			);
		}

		const data: CheckoutSessionResponse = await checkoutResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Checkout session error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
