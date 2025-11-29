import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Health check endpoint without caching - always fresh status.
 */
export async function GET() {
	try {
		// Call DealScale backend API for uncached health check
		const healthResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/health-uncached`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-cache, no-store, must-revalidate",
				},
			},
		);

		if (!healthResponse.ok) {
			console.error(
				"Backend uncached health check failed:",
				healthResponse.status,
				await healthResponse.text(),
			);
			return NextResponse.json(
				{
					status: "unhealthy",
					backend: "down",
					timestamp: new Date().toISOString(),
					cached: false,
				},
				{
					status: 503,
					headers: {
						"Cache-Control": "no-cache, no-store, must-revalidate",
						Pragma: "no-cache",
						Expires: "0",
					},
				},
			);
		}

		const data = await healthResponse.json();
		return NextResponse.json(
			{
				status: "healthy",
				frontend: "up",
				backend: "up",
				timestamp: new Date().toISOString(),
				cached: false,
				...data,
			},
			{
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
					Expires: "0",
				},
			},
		);
	} catch (error) {
		console.error("Uncached health check error:", error);
		return NextResponse.json(
			{
				status: "unhealthy",
				frontend: "up",
				backend: "down",
				error: "Backend unreachable",
				timestamp: new Date().toISOString(),
				cached: false,
			},
			{
				status: 503,
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
					Expires: "0",
				},
			},
		);
	}
}
