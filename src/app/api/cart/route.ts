import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type { CartResponse } from "../../../types/cart";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get user's current shopping cart.
 *
 * Requirements:
 * - Must be logged in
 * - Returns cart contents with all items
 * - Cart summary with totals
 * - Creates empty cart if none exists
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		// Build query string
		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to get cart
		const cartResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!cartResponse.ok) {
			console.error(
				"Failed to get cart:",
				cartResponse.status,
				await cartResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get cart" },
				{ status: 500 },
			);
		}

		const data: CartResponse = await cartResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Get cart error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Clear all items from the cart.
 *
 * Requirements:
 * - Must be logged in
 */
export async function DELETE(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		// Build query string
		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to clear cart
		const clearResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart${queryString ? `?${queryString}` : ""}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!clearResponse.ok) {
			console.error(
				"Failed to clear cart:",
				clearResponse.status,
				await clearResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to clear cart" },
				{ status: 500 },
			);
		}

		const data: CartResponse = await clearResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Clear cart error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
