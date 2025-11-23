import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Get overall voting statistics.
 *
 * Public endpoint - provides aggregate statistics for transparency.
 *
 * Returns:
 * - Total features, votes, and voters
 * - Most requested feature
 * - Voting trends (optional)
 */
export async function GET() {
	try {
		// Call DealScale backend API to get voting stats
		const statsResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/features/stats`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!statsResponse.ok) {
			console.error(
				"Failed to get voting stats:",
				statsResponse.status,
				await statsResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get voting stats" },
				{ status: 500 },
			);
		}

		const data = await statsResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Voting stats error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
