import ServicePageClient from "@/components/services/ServicePageClient";
import { services as allServicesRaw } from "@/data/service/services";
import type { ServiceItemData } from "@/types/service/services";
import { getSeoMetadataForService } from "@/utils/seo/dynamic/services";
import { SchemaInjector, buildServiceJsonLd } from "@/utils/seo/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Next.js 15+ Dynamic Route Compatibility
// Params are now Promises and must be awaited in both generateMetadata and page components.

interface ServicePageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: ServicePageProps): Promise<Metadata> {
	const { slug } = await params;
	const allServices: ServiceItemData[] = Object.values(allServicesRaw).flatMap(
		(category) => Object.values(category),
	);
	return getSeoMetadataForService(slug, allServices);
}

export default async function ServicePage({ params }: ServicePageProps) {
	const { slug } = await params;
	const allServices: ServiceItemData[] = Object.values(allServicesRaw).flatMap(
		(category) => Object.values(category),
	);
	const service =
		allServices.find((s) => s.slugDetails.slug === slug) || null;
	if (!service) return notFound();
	const serviceSchema = buildServiceJsonLd(service);

	return (
		<>
			<SchemaInjector schema={serviceSchema} />
			<ServicePageClient service={service} />
		</>
	);
}
