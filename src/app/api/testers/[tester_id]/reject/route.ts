import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface RouteParams {
	tester_id: string;
}

/**
 * Reject a tester application.
 *
 * Admin Only
 */
export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { tester_id } = await params;
		const { searchParams } = new URL(req.url);
		const reason = searchParams.get("reason");

		// Get required scopes from request body
		let requiredScopes: string[] = [];
		try {
			const body = await req.json();
			requiredScopes = Array.isArray(body) ? body : [];
		} catch {
			// No body or invalid JSON, continue with empty scopes
		}

		// Validate tester_id
		if (!tester_id) {
			return NextResponse.json(
				{ error: "Missing tester_id parameter" },
				{ status: 400 },
			);
		}

		// Build query string
		const queryParams = new URLSearchParams();
		if (reason) {
			queryParams.append("reason", reason);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to reject tester
		const rejectResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/testers/${tester_id}/reject${queryString ? `?${queryString}` : ""}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requiredScopes),
			},
		);

		if (!rejectResponse.ok) {
			console.error(
				"Failed to reject tester:",
				rejectResponse.status,
				await rejectResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to reject tester" },
				{ status: 500 },
			);
		}

		const data = await rejectResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Tester rejection error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
