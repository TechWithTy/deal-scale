import {
	getAllCaseStudies,
	getCaseStudyBySlug,
} from "@/lib/caseStudies/case-studies";
import type { CaseStudy } from "@/types/case-study";
import { getTestBaseUrl } from "@/utils/env";
import { getSeoMetadataForCaseStudy } from "@/utils/seo/dynamic/case-studies";
import {
	SchemaInjector,
	buildCaseStudyCreativeWorkSchema,
} from "@/utils/seo/schema";
import CaseStudyPageClient from "./CaseStudyPageClient";

// Next.js 15+ Dynamic Route Compatibility Workaround
// Do NOT type params in the function signature; use type assertion inside the function.
// This prevents type errors in production builds due to Next.js 15+ breaking changes.

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return getSeoMetadataForCaseStudy(slug);
}

export default async function CaseStudyPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
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

	const baseUrl = getTestBaseUrl();
	const canonicalUrl = `${baseUrl}/case-studies/${params.slug}`;
	const schema = caseStudy
		? buildCaseStudyCreativeWorkSchema(caseStudy, {
				canonicalUrl,
				relatedCaseStudies,
			})
		: undefined;

	return (
		<>
			{schema ? <SchemaInjector schema={schema} /> : null}
			<CaseStudyPageClient
				caseStudy={caseStudy}
				relatedCaseStudies={relatedCaseStudies}
			/>
		</>
	);
}
