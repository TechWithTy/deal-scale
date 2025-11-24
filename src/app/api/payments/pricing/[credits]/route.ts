import { authOptions } from "@/lib/authOptions";
import type { CreditType } from "@/types/payments";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface RouteParams {
	credits: string;
}

/**
 * Get pricing information for a specific credit amount and type.
 *
 * Uses centralized pricing utility for DRY implementation
 * Returns calculated price, savings, and discount information.
 */
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { credits } = await params;
		const { searchParams } = new URL(req.url);
		const creditType = searchParams.get("credit_type") as CreditType;

		// Validate credits parameter
		const creditsNum = Number.parseInt(credits, 10);
		if (Number.isNaN(creditsNum) || creditsNum <= 0) {
			return NextResponse.json(
				{ error: "Invalid credits parameter. Must be a positive integer." },
				{ status: 400 },
			);
		}

		// Validate credit_type if provided
		const allowedCreditTypes: CreditType[] = [
			"lead",
			"ai",
			"skip_trace",
			"custom",
		];
		if (creditType && !allowedCreditTypes.includes(creditType)) {
			return NextResponse.json(
				{
					error: `Invalid credit_type. Must be one of: ${allowedCreditTypes.join(", ")}`,
				},
				{ status: 400 },
			);
		}

		// Build query string
		const queryParams = new URLSearchParams();
		if (creditType) {
			queryParams.append("credit_type", creditType);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to get pricing for specific credits
		const pricingResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/payments/pricing/${credits}${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!pricingResponse.ok) {
			console.error(
				"Failed to get pricing:",
				pricingResponse.status,
				await pricingResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get pricing information" },
				{ status: 500 },
			);
		}

		const data = await pricingResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Pricing error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
