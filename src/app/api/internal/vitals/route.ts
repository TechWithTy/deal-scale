import { NextResponse } from "next/server";

import { sanitizeMetricPayload } from "./sanitizeMetricPayload";

export async function POST(request: Request) {
	const incoming = await request.json().catch(() => undefined);
	const payload = sanitizeMetricPayload(incoming);

	if (!payload) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	const webhookUrl = process.env.WEB_VITALS_WEBHOOK;

	if (webhookUrl) {
		try {
			await fetch(webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: Logging helps diagnose webhook issues.
			console.error("Failed to forward web vitals", error);
		}
	}

	return NextResponse.json({ received: true }, { status: 202 });
}
