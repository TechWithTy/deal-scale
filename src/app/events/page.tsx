import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import EventClient from "./EventClient";

// * Centralized SEO for /events using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/events");
	return mapSeoMetaToMetadata(seo);
}

export default function EventsPage() {
	return <EventClient />;
}
