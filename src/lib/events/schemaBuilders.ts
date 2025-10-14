import { companyData } from "@/data/company";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";
import { defaultSeo, staticSeoMeta } from "@/utils/seo/staticSeo";

const SCHEMA_CONTEXT = "https://schema.org";
const ITEM_LIST_ORDER_ASC = "https://schema.org/ItemListOrderAscending";
const EVENTS_CANONICAL_BASE = (staticSeoMeta["/events"]?.canonical || "https://dealscale.io/events").replace(/\/$/, "");

export function buildEventUrl(slug: string): string {
        return `${EVENTS_CANONICAL_BASE}/${slug}`;
}

function parseTime(value: string): { start?: string; end?: string } {
        const [start, end] = value.split("-").map((segment) => segment.trim()).filter(Boolean);
        return {
                start,
                end,
        };
}

function combineDateAndTime(date: string, time: string | undefined): string | undefined {
        if (!time) {
                const parsed = new Date(date);
                return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
        }

        const isoCandidate = new Date(`${date}T${time}`);
        if (Number.isNaN(isoCandidate.getTime())) {
                        return undefined;
        }
        return isoCandidate.toISOString();
}

function resolveLocation(event: NormalizedEvent) {
        const normalized = event.location.toLowerCase();
        const isOnline = ["online", "virtual", "remote"].some((keyword) => normalized.includes(keyword));

        if (isOnline) {
                return {
                        attendanceMode: "https://schema.org/OnlineEventAttendanceMode",
                        location: {
                                "@type": "VirtualLocation",
                                url: event.externalUrl,
                                name: event.title,
                        },
                } as const;
        }

        const [city, region] = event.location.split(",").map((part) => part.trim());

        return {
                attendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                location: {
                        "@type": "Place",
                        name: event.location,
                        address: {
                                "@type": "PostalAddress",
                                addressLocality: city,
                                addressRegion: region || undefined,
                                addressCountry: region && region.length === 2 ? "US" : undefined,
                        },
                },
        } as const;
}

export function buildEventSchema(event: NormalizedEvent) {
        const { attendanceMode, location } = resolveLocation(event);
        const { start, end } = parseTime(event.time);
        const startDate = combineDateAndTime(event.date, start);
        const endDate = combineDateAndTime(event.date, end);

        return {
                "@context": SCHEMA_CONTEXT,
                "@type": "Event",
                name: event.title,
                description: event.description,
                url: buildEventUrl(event.slug),
                startDate,
                endDate,
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode: attendanceMode,
                location,
                image: event.thumbnailImage ? [event.thumbnailImage] : undefined,
                organizer: {
                        "@type": "Organization",
                        name: companyData.companyName,
                        url: defaultSeo.canonical,
                },
                offers: {
                        "@type": "Offer",
                        price: 0,
                        priceCurrency: "USD",
                        availability: "https://schema.org/InStock",
                        url: event.externalUrl,
                },
        };
}

export function buildEventsItemListSchema(events: NormalizedEvent[]) {
        return {
                "@context": SCHEMA_CONTEXT,
                "@type": "ItemList",
                name: "DealScale Events",
                itemListOrder: ITEM_LIST_ORDER_ASC,
                itemListElement: events.map((event, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        url: buildEventUrl(event.slug),
                        name: event.title,
                        item: buildEventSchema(event),
                })),
        };
}
