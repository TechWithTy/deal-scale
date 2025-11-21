import { caseStudies } from "@/data/caseStudy/caseStudies";

export type CaseStudy = (typeof caseStudies)[number];

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
	return caseStudies.find((study) => study.slug === slug) || null;
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
	return caseStudies;
}
