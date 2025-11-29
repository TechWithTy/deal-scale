import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Telemetry health endpoint for monitoring systems.
 */
export async function GET() {
	try {
		// Call DealScale backend API for telemetry health
		const telemetryResponse = await fetch(
			`${DEALSCALE_API_BASE}/health/telemetry`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!telemetryResponse.ok) {
			console.error(
				"Backend telemetry health failed:",
				telemetryResponse.status,
				await telemetryResponse.text(),
			);
			return NextResponse.json(
				{
					status: "unhealthy",
					frontend_telemetry: "up",
					backend_telemetry: "down",
					timestamp: new Date().toISOString(),
					services: {
						prometheus: "unknown",
						grafana: "unknown",
						loki: "unknown",
						tempo: "unknown",
					},
				},
				{ status: 503 },
			);
		}

		const data = await telemetryResponse.json();
		return NextResponse.json({
			status: "healthy",
			frontend_telemetry: "up",
			backend_telemetry: "up",
			timestamp: new Date().toISOString(),
			...data,
		});
	} catch (error) {
		console.error("Telemetry health error:", error);
		return NextResponse.json(
			{
				status: "unhealthy",
				frontend_telemetry: "up",
				backend_telemetry: "down",
				error: "Backend telemetry unreachable",
				timestamp: new Date().toISOString(),
			},
			{ status: 503 },
		);
	}
}
