import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get user's credit transaction history.
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

		// Call DealScale backend API to get credit history
		const historyResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credits/history`,
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

		if (!historyResponse.ok) {
			console.error(
				"Failed to get credit history:",
				historyResponse.status,
				await historyResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get credit history" },
				{ status: 500 },
			);
		}

		const data = await historyResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Credit history error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
