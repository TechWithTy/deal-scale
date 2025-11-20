import { NextResponse } from "next/server";

import { getAnalyticsConfig } from "@/lib/analytics/config";

export async function GET() {
	const { config, warnings, fallbacksUsed, errors, hasErrors } =
		getAnalyticsConfig();

	if (hasErrors) {
		console.error(
			"[init-providers] Analytics misconfiguration detected",
			errors,
		);
		return NextResponse.json(
			{
				error: "Analytics providers are misconfigured.",
				details: errors,
			},
			{
				status: 503,
				headers: { "Cache-Control": "no-store" },
			},
		);
	}

	const sanitizedConfig = Object.fromEntries(
		Object.entries(config).filter(([, value]) => Boolean(value)),
	);

	return NextResponse.json(
		{
			...sanitizedConfig,
			warnings,
			fallbacksUsed,
		},
		{
			status: 200,
			headers: { "Cache-Control": "no-store" },
		},
	);
}
