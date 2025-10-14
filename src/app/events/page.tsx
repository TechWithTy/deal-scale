import { fetchEvents, EVENTS_REVALIDATE_SECONDS } from "@/lib/events/fetchEvents";
import { buildEventsItemListSchema } from "@/lib/events/schemaBuilders";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";

import EventClient from "./EventClient";

export const revalidate = EVENTS_REVALIDATE_SECONDS;

// * Centralized SEO for /events using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/events");
	return mapSeoMetaToMetadata(seo);
}

export default async function EventsPage() {
        const events = await fetchEvents();
        const itemListSchema = buildEventsItemListSchema(events);

        return (
                <>
                        <SchemaInjector schema={itemListSchema} />
                        <EventClient events={events} />
                </>
        );
}
