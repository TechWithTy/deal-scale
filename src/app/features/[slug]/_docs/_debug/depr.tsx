import ServicePageClient from "@/components/services/ServicePageClient";
import { services as allServicesRaw } from "@/data/service/services";
import type { ServiceItemData } from "@/types/service/services";
import { getSeoMetadataForService } from "@/utils/seo/dynamic/services";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const allServices: ServiceItemData[] = Object.values(allServicesRaw).flatMap(
		(category) => Object.values(category),
	);
	return getSeoMetadataForService(params.slug, allServices);
}

interface PageProps {
	params: { slug: string };
}

export default async function ServicePage({ params }: PageProps) {
	const allServices: ServiceItemData[] = Object.values(allServicesRaw).flatMap(
		(category) => Object.values(category),
	);
	const service =
		allServices.find((s) => s.slugDetails.slug === params.slug) || null;
	if (!service) return notFound();
	return <ServicePageClient service={service} />;
}
