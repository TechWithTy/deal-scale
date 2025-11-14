import { events as fallbackEvents } from "@/data/events";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";

import { EVENTS_REVALIDATE_SECONDS } from "./constants";
import {
	EventRecordSchema,
	EventsResponseSchema,
	normalizeEvent,
} from "./eventSchemas";

const EVENTS_REQUEST_TIMEOUT_MS = 3_000;

function isValidEventsPayload(
	value: unknown,
): value is { events: unknown[] } {
	if (typeof value !== "object" || !value) {
		return false;
	}
	if (!("events" in value)) {
		return false;
	}
	return Array.isArray((value as { events: unknown[] }).events);
}

function buildEventsEndpoint(): string {
	const apiBase = process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";
	return `${apiBase.replace(/\/$/, "")}/api/v1/events`;
}

async function requestRemoteEvents(): Promise<NormalizedEvent[]> {
	const controller = new AbortController();
	const timeoutId = setTimeout(
		() => controller.abort(),
		EVENTS_REQUEST_TIMEOUT_MS,
	);

	try {
		const endpoint = buildEventsEndpoint();
		const response = await fetch(endpoint, {
			headers: { Accept: "application/json" },
			next: { revalidate: EVENTS_REVALIDATE_SECONDS },
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new Error(
				`Failed to load events: ${response.status} ${response.statusText}`,
			);
		}

		let payload: unknown;
		try {
			payload = await response.json();
		} catch (parseError) {
			throw new Error("Failed to parse events response as JSON", {
				cause: parseError instanceof Error ? parseError : undefined,
			});
		}

		if (!isValidEventsPayload(payload)) {
			throw new Error(
				"Events payload missing expected shape { events: [...] }",
			);
		}

		const parsed = EventsResponseSchema.safeParse(payload);

		if (!parsed.success) {
			throw new Error("Invalid event payload received from API");
		}

		return parsed.data.events.map(normalizeEvent);
	} catch (error) {
		const errorName = (error as Error | undefined)?.name;
		if (errorName === "AbortError") {
			throw new Error("Failed to load events: request timed out");
		}
		if (error instanceof Error) {
			error.message = `[events] remote fetch error: ${error.message}`;
			throw error;
		}
		throw new Error("[events] remote fetch error: unknown error");
	} finally {
		clearTimeout(timeoutId);
	}
}

function mapFallbackEvents(): NormalizedEvent[] {
	return fallbackEvents.map((event) =>
		normalizeEvent(EventRecordSchema.parse(event)),
	);
}

export async function fetchEvents(): Promise<NormalizedEvent[]> {
	try {
		return await requestRemoteEvents();
	} catch (error) {
		console.warn("[events] Falling back to static dataset", error);
		return mapFallbackEvents();
	}
}
