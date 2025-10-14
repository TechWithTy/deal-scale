import { events as fallbackEvents } from "@/data/events";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";

import { EVENTS_REVALIDATE_SECONDS } from "./constants";
import {
        EventRecordSchema,
        EventsResponseSchema,
        normalizeEvent,
} from "./eventSchemas";

function buildEventsEndpoint(): string {
        const apiBase = process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";
        return `${apiBase.replace(/\/$/, "")}/api/v1/events`;
}

async function requestRemoteEvents(): Promise<NormalizedEvent[]> {
        const response = await fetch(buildEventsEndpoint(), {
                headers: { Accept: "application/json" },
                next: { revalidate: EVENTS_REVALIDATE_SECONDS },
        });

        if (!response.ok) {
                throw new Error(`Failed to load events: ${response.status}`);
        }

        const payload = await response.json();
        const parsed = EventsResponseSchema.safeParse(payload);

        if (!parsed.success) {
                throw new Error("Invalid event payload received from API");
        }

        return parsed.data.events.map(normalizeEvent);
}

function mapFallbackEvents(): NormalizedEvent[] {
        return fallbackEvents.map((event) => normalizeEvent(EventRecordSchema.parse(event)));
}

export async function fetchEvents(): Promise<NormalizedEvent[]> {
        try {
                return await requestRemoteEvents();
        } catch (error) {
                console.warn("[events] Falling back to static dataset", error);
                return mapFallbackEvents();
        }
}
