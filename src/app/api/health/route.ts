import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Health check endpoint with caching.
 */
export async function GET() {
	try {
		// Call DealScale backend API for health check
		const healthResponse = await fetch(`${DEALSCALE_API_BASE}/api/v1/health`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!healthResponse.ok) {
			console.error(
				"Backend health check failed:",
				healthResponse.status,
				await healthResponse.text(),
			);
			return NextResponse.json(
				{
					status: "unhealthy",
					backend: "down",
					timestamp: new Date().toISOString(),
				},
				{ status: 503 },
			);
		}

		const data = await healthResponse.json();
		return NextResponse.json({
			status: "healthy",
			frontend: "up",
			backend: "up",
			timestamp: new Date().toISOString(),
			...data,
		});
	} catch (error) {
		console.error("Health check error:", error);
		return NextResponse.json(
			{
				status: "unhealthy",
				frontend: "up",
				backend: "down",
				error: "Backend unreachable",
				timestamp: new Date().toISOString(),
			},
			{ status: 503 },
		);
	}
}
