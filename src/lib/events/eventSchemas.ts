import type {
	Event,
	EventAccessType,
	EventAttendanceType,
} from "@/types/event";
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
		externalUrl: z.string().url().optional(),
		youtubeUrl: z.string().url().optional(),
		category: z.string(),
		location: z.string(),
		isFeatured: z.boolean().optional(),
		internalPath: z
			.string()
			.min(1, "Internal path must not be empty")
			.optional(),
		accessType: z
			.enum(["internal", "external"])
			.optional()
			.default("external")
			.catch("external"),
		attendanceType: z
			.enum(["in-person", "webinar", "hybrid"])
			.optional()
			.default("in-person")
			.catch("in-person"),
	})
	.strict();

export const EventsResponseSchema = z.object({
	events: z.array(EventRecordSchema),
});

export type EventRecord = z.infer<typeof EventRecordSchema>;

export type NormalizedEvent = Omit<
	Event,
	"slug" | "accessType" | "attendanceType"
> & {
	slug: string;
	accessType: EventAccessType;
	attendanceType: EventAttendanceType;
};

export function normalizeEvent(record: EventRecord): NormalizedEvent {
	const slug = record.slug?.trim();
	return {
		...record,
		accessType: record.accessType ?? "external",
		attendanceType: record.attendanceType ?? "in-person",
		slug:
			slug && slug.length > 0 ? slug : createEventSlug(record.title, record.id),
	} as NormalizedEvent;
}
