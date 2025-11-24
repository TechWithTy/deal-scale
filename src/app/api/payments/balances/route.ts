import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Get user's credit balances for all credit types.
 *
 * Returns current balance for each credit type with detailed breakdown.
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get required scopes from request body (if any)
		let requiredScopes: string[] = [];
		try {
			const body = await req.json();
			requiredScopes = Array.isArray(body) ? body : [];
		} catch {
			// No body or invalid JSON, continue with empty scopes
		}

		// Call DealScale backend API to get credit balances
		const balancesResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/payments/balances`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body:
					requiredScopes.length > 0
						? JSON.stringify(requiredScopes)
						: undefined,
			},
		);

		if (!balancesResponse.ok) {
			console.error(
				"Failed to get credit balances:",
				balancesResponse.status,
				await balancesResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get credit balances" },
				{ status: 500 },
			);
		}

		const data = await balancesResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Credit balances error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
