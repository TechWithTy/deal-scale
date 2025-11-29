import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get all votes cast by the current user.
 *
 * Returns:
 * - List of user's votes with feature details
 * - Vote weights and timestamps
 * - Total vote count
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

		// Call DealScale backend API to get user's votes
		const votesResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/features/my-votes${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!votesResponse.ok) {
			console.error(
				"Failed to get user votes:",
				votesResponse.status,
				await votesResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get user votes" },
				{ status: 500 },
			);
		}

		const data = await votesResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("User votes error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
