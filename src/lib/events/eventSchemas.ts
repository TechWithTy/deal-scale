import type { Event } from "@/types/event";
import { z } from "zod";

import { createEventSlug } from "./slug";

export const EventRecordSchema = z
	.object({
		id: z.string(),
		slug: z.string().optional(),
		title: z.string(),
		date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
			message: "Invalid event date",
		}),
		time: z.string(),
		description: z.string(),
		thumbnailImage: z.string().url().optional(),
		externalUrl: z.string().url(),
		youtubeUrl: z.string().url().optional(),
		category: z.string(),
		location: z.string(),
		isFeatured: z.boolean().optional(),
	})
	.strict();

export const EventsResponseSchema = z.object({
	events: z.array(EventRecordSchema),
});

export type EventRecord = z.infer<typeof EventRecordSchema>;

export type NormalizedEvent = Event & { slug: string };

export function normalizeEvent(record: EventRecord): NormalizedEvent {
	const slug = record.slug?.trim();
	return {
		...record,
		slug:
			slug && slug.length > 0 ? slug : createEventSlug(record.title, record.id),
	} as NormalizedEvent;
}
