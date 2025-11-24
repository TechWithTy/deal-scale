import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Get current user's tester status and eligibility.
 *
 * Returns:
 * - Beta tester status and dates
 * - Pilot tester status and dates
 * - Feature voting eligibility
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

		// Call DealScale backend API to get tester status
		const statusResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/testers/me${queryString ? `?${queryString}` : ""}`,
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
				"Failed to get tester status:",
				statusResponse.status,
				await statusResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get tester status" },
				{ status: 500 },
			);
		}

		const data = await statusResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Tester status error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
