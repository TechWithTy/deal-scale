import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get application metrics for monitoring.
 *
 * This endpoint provides Prometheus-compatible metrics.
 */
export async function GET() {
	try {
		// Call DealScale backend API for metrics
		const metricsResponse = await fetch(`${DEALSCALE_API_BASE}/metrics`, {
			method: "GET",
			headers: {
				"Content-Type": "text/plain",
			},
		});

		if (!metricsResponse.ok) {
			console.error(
				"Failed to get metrics:",
				metricsResponse.status,
				await metricsResponse.text(),
			);
			return new NextResponse("# Failed to fetch backend metrics\n", {
				status: 503,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
				},
			});
		}

		const metricsText = await metricsResponse.text();

		// Add frontend-specific metrics
		const frontendMetrics = `
# HELP frontend_health Frontend service health status
# TYPE frontend_health gauge
frontend_health 1

# HELP frontend_uptime_seconds Frontend uptime in seconds
# TYPE frontend_uptime_seconds counter
frontend_uptime_seconds ${Math.floor(process.uptime())}

# HELP frontend_memory_usage_bytes Frontend memory usage in bytes
# TYPE frontend_memory_usage_bytes gauge
frontend_memory_usage_bytes ${process.memoryUsage().heapUsed}

`;

		const combinedMetrics = frontendMetrics + metricsText;

		return new NextResponse(combinedMetrics, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache, no-store, must-revalidate",
			},
		});
	} catch (error) {
		console.error("Metrics error:", error);
		return new NextResponse("# Metrics collection failed\n", {
			status: 500,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		});
	}
}
