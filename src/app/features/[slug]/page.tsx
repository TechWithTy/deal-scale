import ServicePageClient from "@/components/services/ServicePageClient";
import { services as allServicesRaw } from "@/data/service/services";
import type { ServiceItemData } from "@/types/service/services";
import { getSeoMetadataForService } from "@/utils/seo/dynamic/services";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Next.js 15+ Dynamic Route Compatibility Workaround
// Use Promise type for params in generateMetadata; use type assertion inside the page function.
// This prevents type errors in production builds due to Next.js 15+ breaking changes.

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const allServices: ServiceItemData[] = Object.values(allServicesRaw).flatMap(
		(category) => Object.values(category),
	);
	return getSeoMetadataForService(slug, allServices);
}

export default async function ServicePage(props: unknown) {
	const { params } = props as { params: { slug: string } };
	const allServices: ServiceItemData[] = Object.values(allServicesRaw).flatMap(
		(category) => Object.values(category),
	);
	const service =
		allServices.find((s) => s.slugDetails.slug === params.slug) || null;
	if (!service) return notFound();
	return <ServicePageClient service={service} />;
}
