import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type { CheckoutRequest, CheckoutResponse } from "../../../../types/cart";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Checkout the user's cart and create a payment session.
 *
 * Requirements:
 * - Must be logged in
 * - Must have items in cart
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const body = (await req.json()) as CheckoutRequest;

		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		const checkoutResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart/checkout${queryString ? `?${queryString}` : ""}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!checkoutResponse.ok) {
			console.error(
				"Failed to checkout cart:",
				checkoutResponse.status,
				await checkoutResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to checkout cart" },
				{ status: 500 },
			);
		}

		const data: CheckoutResponse = await checkoutResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Cart checkout error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
