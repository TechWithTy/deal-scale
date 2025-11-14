import { authOptions } from "@/lib/authOptions";
import type { CartResponse, UpdateCartItemRequest } from "@/types/cart";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

function isValidUpdateRequest(body: UpdateCartItemRequest): boolean {
	return (
		typeof body.quantity === "number" &&
		Number.isInteger(body.quantity) &&
		body.quantity >= 0
	);
}

interface RouteParams {
	item_id: string;
}

/**
 * Update an item in the user's cart.
 *
 * Requirements:
 * - Must be logged in
 * - Item must exist in user's cart
 *
 * Behavior:
 * - quantity > 0: Updates item quantity
 * - quantity = 0: Removes item from cart
 */
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { item_id } = await params;
		if (!item_id) {
			return NextResponse.json(
				{ error: "Missing item_id parameter" },
				{ status: 400 },
			);
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const body = (await req.json()) as UpdateCartItemRequest;
		if (!isValidUpdateRequest(body)) {
			return NextResponse.json(
				{
					error: "Invalid body. quantity must be an integer >= 0.",
				},
				{ status: 400 },
			);
		}

		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		const updateResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart/items/${item_id}${queryString ? `?${queryString}` : ""}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!updateResponse.ok) {
			console.error(
				"Failed to update cart item:",
				updateResponse.status,
				await updateResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to update cart item" },
				{ status: 500 },
			);
		}

		const data: CartResponse = await updateResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Update cart item error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Remove an item from the user's cart.
 *
 * Requirements:
 * - Must be logged in
 */
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { item_id } = await params;
		if (!item_id) {
			return NextResponse.json(
				{ error: "Missing item_id parameter" },
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

		const deleteResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/cart/items/${item_id}${queryString ? `?${queryString}` : ""}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!deleteResponse.ok) {
			console.error(
				"Failed to remove cart item:",
				deleteResponse.status,
				await deleteResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to remove cart item" },
				{ status: 500 },
			);
		}

		const data: CartResponse = await deleteResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Remove cart item error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
