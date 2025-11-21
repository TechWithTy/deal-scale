import { NextResponse } from "next/server";
import { z } from "zod";

const statusSchema = z.enum(["idle", "loading", "ready", "error"]);

const guardPayloadSchema = z.object({
	key: z.string().min(1),
	surface: z.string().min(1),
	status: statusSchema,
	hasData: z.boolean(),
	error: z.string().optional(),
	detail: z.record(z.any()).optional(),
	timestamp: z.number().optional(),
	environment: z.string().optional(),
});

type GuardPayload = z.infer<typeof guardPayloadSchema>;

function sanitizePayload(payload: unknown): GuardPayload | null {
	const parsed = guardPayloadSchema.safeParse(payload);
	if (!parsed.success) {
		return null;
	}

	return {
		...parsed.data,
		timestamp: parsed.data.timestamp ?? Date.now(),
	} satisfies GuardPayload;
}

export async function POST(request: Request) {
	const incoming = await request.json().catch(() => undefined);
	const payload = sanitizePayload(incoming);

	if (!payload) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	const webhookUrl = process.env.DATA_GUARD_WEBHOOK;

	if (webhookUrl) {
		try {
			await fetch(webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
		} catch (error) {
			console.error("[data-guards] Failed to forward event", error);
		}
	} else {
		console.info("[data-guards]", payload);
	}

	return NextResponse.json({ received: true }, { status: 202 });
}
