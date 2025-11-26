import type { DataModuleKey } from "@/data/__generated__/manifest";
import { createDataModuleStore } from "@/stores/useDataModuleStore";

export const dataStores = {
	"about/hero": createDataModuleStore("about/hero"),
	"about/marquee": createDataModuleStore("about/marquee"),
	"about/milestones": createDataModuleStore("about/milestones"),
	"about/team": createDataModuleStore("about/team"),
	"about/timeline": createDataModuleStore("about/timeline"),
	"about/timelineSummary": createDataModuleStore("about/timelineSummary"),
	"activity/activityStream": createDataModuleStore("activity/activityStream"),
	affiliate: createDataModuleStore("affiliate"),
	"auth/formFields": createDataModuleStore("auth/formFields"),
	"auth/resetPassword": createDataModuleStore("auth/resetPassword"),
	"auth/signIn": createDataModuleStore("auth/signIn"),
	"auth/signUp": createDataModuleStore("auth/signUp"),
	"bento/caseStudy": createDataModuleStore("bento/caseStudy"),
	"bento/landingSnapshot": createDataModuleStore("bento/landingSnapshot"),
	"bento/main": createDataModuleStore("bento/main"),
	"caseStudy/caseStudies": createDataModuleStore("caseStudy/caseStudies"),
	"caseStudy/slugDetails/copy": createDataModuleStore(
		"caseStudy/slugDetails/copy",
	),
	"caseStudy/slugDetails/testimonials": createDataModuleStore(
		"caseStudy/slugDetails/testimonials",
	),
	categories: createDataModuleStore("categories"),
	"closers/mockClosers": createDataModuleStore("closers/mockClosers"),
	company: createDataModuleStore("company"),
	"constants/booking": createDataModuleStore("constants/booking"),
	"constants/legal/cookies": createDataModuleStore("constants/legal/cookies"),
	"constants/legal/GDPR": createDataModuleStore("constants/legal/GDPR"),
	"constants/legal/hippa": createDataModuleStore("constants/legal/hippa"),
	"constants/legal/PII": createDataModuleStore("constants/legal/PII"),
	"constants/legal/privacy": createDataModuleStore("constants/legal/privacy"),
	"constants/legal/tcpCompliance": createDataModuleStore(
		"constants/legal/tcpCompliance",
	),
	"constants/legal/terms": createDataModuleStore("constants/legal/terms"),
	"constants/seo": createDataModuleStore("constants/seo"),
	"contact/affiliate": createDataModuleStore("contact/affiliate"),
	"contact/authFormFields": createDataModuleStore("contact/authFormFields"),
	"contact/closer": createDataModuleStore("contact/closer"),
	"contact/formFields": createDataModuleStore("contact/formFields"),
	"contact/pilotFormFields": createDataModuleStore("contact/pilotFormFields"),
	discount: createDataModuleStore("discount"),
	"discount/mockDiscountCodes": createDataModuleStore(
		"discount/mockDiscountCodes",
	),
	events: createDataModuleStore("events"),
	"faq/default": createDataModuleStore("faq/default"),
	"faq/personaFaq": createDataModuleStore("faq/personaFaq"),
	features: createDataModuleStore("features"),
	"features/deal_scales_timeline": createDataModuleStore(
		"features/deal_scales_timeline",
	),
	"features/feature_timeline": createDataModuleStore(
		"features/feature_timeline",
	),
	"home/aiOutreachStudio": createDataModuleStore("home/aiOutreachStudio"),
	"landing/strapiLandingContent": createDataModuleStore(
		"landing/strapiLandingContent",
	),
	"layout/nav": createDataModuleStore("layout/nav"),
	"legal/legalDocuments": createDataModuleStore("legal/legalDocuments"),
	"medium/post": createDataModuleStore("medium/post"),
	mlsProperties: createDataModuleStore("mlsProperties"),
	partners: createDataModuleStore("partners"),
	"personas/catalog": createDataModuleStore("personas/catalog"),
	"personas/testimonialsByPersona": createDataModuleStore(
		"personas/testimonialsByPersona",
	),
	portfolio: createDataModuleStore("portfolio"),
	products: createDataModuleStore("products"),
	"products/agents": createDataModuleStore("products/agents"),
	"products/closers": createDataModuleStore("products/closers"),
	"products/copy": createDataModuleStore("products/copy"),
	"products/credits": createDataModuleStore("products/credits"),
	"products/essentials": createDataModuleStore("products/essentials"),
	"products/free-resource-copy": createDataModuleStore(
		"products/free-resource-copy",
	),
	"products/free-resources": createDataModuleStore("products/free-resources"),
	"products/hero": createDataModuleStore("products/hero"),
	"products/license": createDataModuleStore("products/license"),
	"products/monetize": createDataModuleStore("products/monetize"),
	"products/notion": createDataModuleStore("products/notion"),
	"products/reviews": createDataModuleStore("products/reviews"),
	"products/sizingChart": createDataModuleStore("products/sizingChart"),
	"products/workflow": createDataModuleStore("products/workflow"),
	projects: createDataModuleStore("projects"),
	"service/services": createDataModuleStore("service/services"),
	"service/slug_data/consultationSteps": createDataModuleStore(
		"service/slug_data/consultationSteps",
	),
	"service/slug_data/copyright": createDataModuleStore(
		"service/slug_data/copyright",
	),
	"service/slug_data/faq": createDataModuleStore("service/slug_data/faq"),
	"service/slug_data/how_it_works": createDataModuleStore(
		"service/slug_data/how_it_works",
	),
	"service/slug_data/integrations": createDataModuleStore(
		"service/slug_data/integrations",
	),
	"service/slug_data/methodologies": createDataModuleStore(
		"service/slug_data/methodologies",
	),
	"service/slug_data/pricing": createDataModuleStore(
		"service/slug_data/pricing",
	),
	"service/slug_data/pricing/other": createDataModuleStore(
		"service/slug_data/pricing/other",
	),
	"service/slug_data/pricing/roiEstimator": createDataModuleStore(
		"service/slug_data/pricing/roiEstimator",
	),
	"service/slug_data/problems_solutions": createDataModuleStore(
		"service/slug_data/problems_solutions",
	),
	"service/slug_data/testimonials": createDataModuleStore(
		"service/slug_data/testimonials",
	),
	"service/slug_data/trustedCompanies": createDataModuleStore(
		"service/slug_data/trustedCompanies",
	),
	shipping: createDataModuleStore("shipping"),
	skiptTraceExample: createDataModuleStore("skiptTraceExample"),
	"social/share": createDataModuleStore("social/share"),
	transcripts: createDataModuleStore("transcripts"),
	"transcripts/voiceCloningAfter": createDataModuleStore(
		"transcripts/voiceCloningAfter",
	),
	"transcripts/voiceCloningBefore": createDataModuleStore(
		"transcripts/voiceCloningBefore",
	),
	values: createDataModuleStore("values"),
	"worklow/dsl": createDataModuleStore("worklow/dsl"),
} as const satisfies Record<
	DataModuleKey,
	ReturnType<typeof createDataModuleStore>
>;

export const dataStoreKeys = Object.keys(dataStores) as DataModuleKey[];
