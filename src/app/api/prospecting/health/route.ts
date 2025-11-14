import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Health check endpoint for prospecting service.
 */
export async function GET() {
	try {
		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/prospecting/health`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			console.error(
				"Prospecting health check failed:",
				response.status,
				await response.text(),
			);
			return NextResponse.json({ status: "unhealthy" }, { status: 503 });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Prospecting health error:", error);
		return NextResponse.json({ status: "unhealthy" }, { status: 503 });
	}
}
