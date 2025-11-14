import { getCaseStudyBySlug } from "@/lib/caseStudies/case-studies";
import { getTestBaseUrl } from "@/utils/env";
import type { SeoMeta } from "@/utils/seo/seo";

export async function getSeoMetadataForCaseStudy(
	slug: string,
): Promise<SeoMeta> {
	const caseStudy = getCaseStudyBySlug(slug);
	const baseUrl = getTestBaseUrl();
	const pageUrl = `${baseUrl}/case-studies/${slug}`;

	if (!caseStudy) {
		return {
			title: "Case Study Not Found",
			description: "The requested case study could not be found",
			canonical: pageUrl,
			keywords: [],
			image: "",
			type: "article",
			priority: 0.7, // * fallback
			changeFrequency: "weekly", // * fallback
		};
	}

	return {
		title: `${caseStudy.title} | Case Study | Deal Scale`,
		description: caseStudy.subtitle || "Case study details.",
		canonical: pageUrl,
		keywords: caseStudy.categories || [],
		image: caseStudy.featuredImage || "/banners/CaseStudy2.png",
		type: "article",
		datePublished: caseStudy.lastModified?.toISOString?.() || undefined,
		dateModified: caseStudy.lastModified?.toISOString?.() || undefined,
		priority: 0.7, // * or customize per case study
		changeFrequency: "weekly", // * or customize per case study
	};
}
