import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Health check endpoint for the enrichment service.
 */
export async function GET() {
	try {
		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/leads/enrich/health`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			console.error(
				"Enrichment health check failed:",
				response.status,
				await response.text(),
			);
			return NextResponse.json({ status: "unhealthy" }, { status: 503 });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Enrichment health error:", error);
		return NextResponse.json({ status: "unhealthy" }, { status: 503 });
	}
}
