import type { ServiceHowItWorks, TechStack } from "./service/services";

export interface BusinessOutcome {
	title: string;
	subtitle: string;
}

export type CaseStudyCopyright = {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink: string;
};

export interface Category {
	id: string;
	name: string;
}

export interface CaseStudy {
	id: string;
	title: string;
	subtitle: string;
	referenceLink?: string;
	slug: string;
	categories: string[];
	industries: string[];
	copyright: CaseStudyCopyright;
	tags: string[];
	clientName: string;
	clientDescription: string;
	featuredImage: string;
	thumbnailImage: string;

	businessChallenges: string[];
	lastModified: Date;
	howItWorks?: ServiceHowItWorks[];
	businessOutcomes: BusinessOutcome[];
	solutions: string[];
	techStacks?: TechStack[];
	description: string;
	results: {
		title: string;
		value: string;
	}[];
	featured?: boolean;
	redirectToContact?: boolean;
}
