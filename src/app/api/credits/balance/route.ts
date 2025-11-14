import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get user's current credit balance across all credit types.
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

		// Call DealScale backend API to get credit balance
		const balanceResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credits/balance`,
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

		if (!balanceResponse.ok) {
			console.error(
				"Failed to get credit balance:",
				balanceResponse.status,
				await balanceResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get credit balance" },
				{ status: 500 },
			);
		}

		const data = await balanceResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Credit balance error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
