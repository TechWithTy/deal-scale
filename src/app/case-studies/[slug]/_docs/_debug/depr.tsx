import {
	type CaseStudy,
	getAllCaseStudies,
	getCaseStudyBySlug,
} from "@/lib/caseStudies/case-studies";
import { getSeoMetadataForCaseStudy } from "@/utils/seo/dynamic/case-studies";

export async function generateMetadata({
	params,
}: { params: { slug: string } }) {
	return getSeoMetadataForCaseStudy(params.slug);
}

// --- Server Component: fetch case study and related data, render client component ---
import type { Metadata } from "next";
import CaseStudyPageClient from "../../CaseStudyPageClient";

interface PageProps {
	params: { slug: string };
}

export default async function CaseStudyPage({ params }: PageProps) {
	const caseStudy = await getCaseStudyBySlug(params.slug);
	let relatedCaseStudies: CaseStudy[] = [];

	if (caseStudy) {
		const allStudies = await getAllCaseStudies();
		relatedCaseStudies = allStudies
			.filter(
				(s) =>
					s.categories.some((category) =>
						caseStudy.categories.includes(category),
					) && s.slug !== params.slug,
			)
			.slice(0, 3);
	}

	// Render the client component with server-fetched data
	return (
		<CaseStudyPageClient
			caseStudy={caseStudy}
			relatedCaseStudies={relatedCaseStudies}
		/>
	);
}
