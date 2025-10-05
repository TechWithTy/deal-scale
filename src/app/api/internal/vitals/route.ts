import { NextResponse } from "next/server";

interface WebVitalsPayload {
	id: string;
	name: string;
	label: string;
	value: number;
	page?: string;
	navigationType?: string;
	rating?: string;
	delta?: number;
	timestamp?: number;
}

function sanitizePayload(
	payload: Partial<WebVitalsPayload>,
): WebVitalsPayload | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const { id, name, label, value } = payload;

	if (!id || !name || !label || typeof value !== "number") {
		return null;
	}

	return {
		id,
		name,
		label,
		value,
		page: typeof payload.page === "string" ? payload.page : undefined,
		navigationType:
			typeof payload.navigationType === "string"
				? payload.navigationType
				: undefined,
		rating: typeof payload.rating === "string" ? payload.rating : undefined,
		delta:
			typeof payload.delta === "number"
				? Number(payload.delta.toFixed(3))
				: undefined,
		timestamp:
			typeof payload.timestamp === "number"
				? Number(payload.timestamp)
				: Date.now(),
	};
}

export async function POST(request: Request) {
	const incoming = await request.json().catch(() => undefined);
	const payload = sanitizePayload(incoming);

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
