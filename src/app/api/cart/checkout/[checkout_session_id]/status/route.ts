import { authOptions } from "@/lib/authOptions";
import type { CheckoutStatusResponse } from "@/types/cart";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface RouteParams {
	checkout_session_id: string;
}

/**
 * Get the status of a checkout session.
 *
 * Requirements:
 * - Must be logged in
 * - Must own the checkout session
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

		const { checkout_session_id: checkoutSessionId } = await params;
		if (!checkoutSessionId) {
			return NextResponse.json(
				{ error: "Missing checkout_session_id parameter" },
				{ status: 400 },
			);
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		const statusResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart/checkout/${checkoutSessionId}/status${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!statusResponse.ok) {
			console.error(
				"Failed to get checkout status:",
				statusResponse.status,
				await statusResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get checkout status" },
				{ status: 500 },
			);
		}

		const data: CheckoutStatusResponse = await statusResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Checkout status error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
