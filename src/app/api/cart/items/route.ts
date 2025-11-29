import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type { AddToCartRequest, CartResponse } from "../../../../types/cart";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

function normalizeRequest(body: AddToCartRequest): AddToCartRequest | null {
	const quantity = body.quantity ?? 1;
	if (
		typeof body.product_sku !== "string" ||
		body.product_sku.trim().length === 0 ||
		typeof body.name !== "string" ||
		body.name.trim().length === 0 ||
		typeof body.unit_price !== "number" ||
		!Number.isFinite(body.unit_price) ||
		body.unit_price < 0 ||
		typeof quantity !== "number" ||
		!Number.isInteger(quantity) ||
		quantity < 1
	) {
		return null;
	}

	return {
		product_sku: body.product_sku.trim(),
		name: body.name.trim(),
		unit_price: body.unit_price,
		quantity,
		metadata: body.metadata,
	};
}

/**
 * Add an item to the user's cart.
 *
 * Requirements:
 * - Must be logged in
 * - Valid product information
 * - Creates cart if none exists
 * - Adds item or updates quantity if item already exists
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const rawBody = (await req.json()) as AddToCartRequest;
		const body = normalizeRequest(rawBody);

		if (!body) {
			return NextResponse.json(
				{
					error:
						"Invalid body. product_sku, name, unit_price (>= 0), and quantity (integer >= 1) are required.",
				},
				{ status: 400 },
			);
		}

		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		const addResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart/items${queryString ? `?${queryString}` : ""}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!addResponse.ok) {
			console.error(
				"Failed to add item to cart:",
				addResponse.status,
				await addResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to add item to cart" },
				{ status: 500 },
			);
		}

		const data: CartResponse = await addResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Add to cart error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
