import { ViewportLazy } from "@/components/common/ViewportLazy";
import ExitIntentBoundary from "@/components/exit-intent/ExitIntentBoundary";
import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import { FeatureShowcase } from "@/components/demos/real-time-analytics/FeatureShowcase";
import { REAL_TIME_FEATURES } from "@/components/demos/real-time-analytics/feature-config";
import { ConnectAnythingHero } from "@/components/home/ConnectAnythingHero";
// Above-the-fold components (eager load for LCP)
import {
	DEFAULT_PERSONA,
	DEFAULT_PERSONA_DISPLAY,
	HERO_COPY_V7,
	LIVE_COPY,
	PERSONA_GOAL,
	PERSONA_LABEL,
} from "@/components/home/heros/live-dynamic-hero-demo/_config";
import LiveDynamicHero from "@/components/home/heros/live-dynamic-hero-demo/page";
import { Separator } from "@/components/ui/separator";
import { activityStream } from "@/data/activity/activityStream";
import { caseStudies } from "@/data/caseStudy/caseStudies";
import { faqItems } from "@/data/faq/default";
import { pricingCatalog } from "@/data/service/slug_data/pricing";
import {
	generalDealScaleTestimonials,
} from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import {
	AI_OUTREACH_STUDIO_ANCHOR,
	AI_OUTREACH_STUDIO_FEATURES,
	AI_OUTREACH_STUDIO_SEO,
	AI_OUTREACH_STUDIO_TAGLINE,
} from "@/data/home/aiOutreachStudio";
import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { cn } from "@/lib/utils";
import type { BeehiivPost } from "@/types/behiiv";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import {
	SchemaInjector,
	buildActivityFeedSchema,
	buildServiceSchema,
	getTestimonialReviewData,
} from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Below-the-fold components (lazy load with dynamic imports for code splitting)
const AboutUsSection = dynamic(
	() => import("@/components/about/AboutUsSection"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);
const CaseStudyGrid = dynamic(
	() => import("@/components/case-studies/CaseStudyGrid"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);
const ContactForm = dynamic(
	() => import("@/components/contact/form/ContactForm"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);
const Faq = dynamic(() => import("@/components/faq"), {
	loading: () => (
		<div className="flex h-96 items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
		</div>
	),
});
const BlogPreview = dynamic(
	() =>
		import("@/components/home/BlogPreview").then((mod) => ({
			default: mod.BlogPreview,
		})),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);
const ClientBento = dynamic(() => import("@/components/home/ClientBento"), {
	loading: () => (
		<div className="flex h-96 items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
		</div>
	),
});
const MarketingCatalogPricing = dynamic(
	() => import("@/components/pricing/CatalogPricing"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
	loading: () => (
		<div className="flex h-96 items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
		</div>
	),
});
const FeatureSectionActivity = dynamic(
	() => import("@/components/home/FeatureSectionActivity"),
	{
		loading: () => (
			<SectionFallback className="min-h-[28rem] rounded-3xl border-dashed" />
		),
	},
);
const CallDemoShowcase = dynamic(
	() =>
		import("@/components/home/CallDemoShowcase").then((mod) => ({
			default: mod.CallDemoShowcase,
		})),
	{
		loading: () => (
			<SectionFallback className="min-h-[28rem] rounded-3xl border-dashed" />
		),
	},
);
const InstagramEmbed = dynamic(
	() => import("@/components/home/InstagramEmbed"),
	{
		loading: () => (
			<SectionFallback className="min-h-[28rem] rounded-3xl border-dashed" />
		),
	},
);

// ! TODO: Add This Section To Landing Page
// Capabilities Showcase
// Technical expertise
// Service portfolio
// Success metrics

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/");
	const persona = HERO_COPY_V7.personas[DEFAULT_PERSONA];

	const personaAudienceLabel =
		PERSONA_LABEL.replace(/^For\s+/i, "").trim() || PERSONA_LABEL;
	const personaPromise = `We orchestrate every deal touchpoint so your ${personaAudienceLabel} stay in deal mode.`;
	const outreachTagline = AI_OUTREACH_STUDIO_TAGLINE;

	const heroKeywordsBase = [
		...seo.keywords,
		PERSONA_LABEL,
		PERSONA_GOAL,
		DEFAULT_PERSONA_DISPLAY,
		outreachTagline,
		personaPromise,
		...persona.problem,
		...persona.solution,
		...persona.fear,
	];
	const heroKeywords = Array.from(new Set(heroKeywordsBase));
	const aiOutreachKeywords = Array.from(AI_OUTREACH_STUDIO_SEO.keywords);
	const combinedKeywords = Array.from(
		new Set([...heroKeywords, ...aiOutreachKeywords]),
	).slice(0, 48);
	const heroDescription =
		LIVE_COPY.subtitle ||
		"Automate investor deal flow, keep motivated sellers warm, and close more profitable real estate deals with Deal Scale’s AI Sales Agents.";
	const aiOutreachDescription = AI_OUTREACH_STUDIO_SEO.description;
	const combinedDescriptionSegments = [
		outreachTagline,
		aiOutreachDescription,
		personaPromise,
		heroDescription,
	];
	const combinedDescription = combinedDescriptionSegments
		.filter((segment) => segment && segment.length > 0)
		.join(" ");

	const enrichedSeo = mapSeoMetaToMetadata({
		...seo,
		title:
			"Deal Scale AI Outreach Studio | Turn Conversations into Conversions Automatically",
		description: combinedDescription,
		keywords: combinedKeywords,
	});

	return enrichedSeo;
}

// Helper function to paginate an array
function paginate<T>(array: T[], page: number, pageSize: number): T[] {
	const start = (page - 1) * pageSize;
	return array.slice(start, start + pageSize);
}

// Default page size for case studies
const CASE_STUDY_PAGE_SIZE = 6;

type IndexSearchParams = {
	page?: string | string[];
};

const SectionFallback = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"flex h-full w-full items-center justify-center rounded-3xl border border-black/10 bg-black/5 backdrop-blur-sm",
			"dark:border-white/10 dark:bg-white/[0.05]",
			className,
		)}
		aria-hidden="true"
	>
		<div className="h-10 w-10 animate-spin rounded-full border-2 border-black/20 border-t-transparent dark:border-white/30" />
	</div>
);

// Main page component
const Index = async ({
	searchParams,
}: { searchParams?: Promise<IndexSearchParams> } = {}) => {
	const resolvedSearchParams: IndexSearchParams = searchParams
		? await searchParams
		: {};
	const pageParam = Array.isArray(resolvedSearchParams.page)
		? resolvedSearchParams.page[0]
		: resolvedSearchParams.page;
	// Get the current page from the query string (SSR-friendly, Next.js style)
	const currentPage = pageParam ? Number.parseInt(pageParam, 10) || 1 : 1;

	// Paginate the case studies
	const paginatedCaseStudies = paginate(
		caseStudies,
		currentPage,
		CASE_STUDY_PAGE_SIZE,
	);

	const posts = await getLatestBeehiivPosts();
	const homepageSeo = getStaticSeo("/");
	const canonicalUrl = homepageSeo.canonical ?? "https://dealscale.io";
	const heroDescription =
		LIVE_COPY.subtitle ||
		"Automate investor deal flow, keep motivated sellers warm, and close more profitable real estate deals with Deal Scale’s AI Sales Agents.";
	const personaAudienceLabel =
		PERSONA_LABEL.replace(/^For\s+/i, "").trim() || PERSONA_LABEL;
	const personaPromise = `We orchestrate every deal touchpoint so your ${personaAudienceLabel} stay in deal mode.`;
	const heroServiceDescription = [personaPromise, heroDescription]
		.filter((segment) => segment && segment.length > 0)
		.join(" ");
	const aiOutreachNarrative = [
		AI_OUTREACH_STUDIO_TAGLINE,
		AI_OUTREACH_STUDIO_SEO.description,
		personaPromise,
	]
		.filter((segment) => segment && segment.length > 0)
		.join(" ");
	const activityNarrative = `Live automation notifications that help ${personaAudienceLabel} stay in deal mode with AI-personalized follow-ups.`;
	const aiOutreachFeatureDescription = `${AI_OUTREACH_STUDIO_TAGLINE} Persona-aware workflows keep ${personaAudienceLabel} in deal mode.`;
	const {
		reviews: testimonialReviews,
		aggregateRating: testimonialAggregateRating,
	} = getTestimonialReviewData();
	const heroServiceSchema = buildServiceSchema({
		name: PERSONA_LABEL,
		description: heroServiceDescription,
		url: `${canonicalUrl}#investor-hero-top`,
		serviceType: PERSONA_GOAL,
		category: "Real Estate Investor Automation",
		areaServed: ["United States"],
		offers: {
			price: "0",
			priceCurrency: "USD",
			url: `${canonicalUrl}/contact`,
		},
		aggregateRating: testimonialAggregateRating,
		reviews: testimonialReviews,
	});
	const aiOutreachServiceSchema = buildServiceSchema({
		name: `${AI_OUTREACH_STUDIO_SEO.name} by Deal Scale`,
		description: aiOutreachNarrative,
		url: `${canonicalUrl}#${AI_OUTREACH_STUDIO_ANCHOR}`,
		serviceType: "AI Outreach Automation",
		category: "Sales Enablement",
		areaServed: ["United States"],
		offers: {
			price: "0",
			priceCurrency: "USD",
			url: `${canonicalUrl}/contact`,
		},
		aggregateRating: testimonialAggregateRating,
		reviews: testimonialReviews,
	});
	const activityFeedSchema = buildActivityFeedSchema(activityStream, {
		url: "/#live-activity-stream",
		description: activityNarrative,
	});
	const aiOutreachFeatureListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		"@id": `${canonicalUrl}#${AI_OUTREACH_STUDIO_ANCHOR}-feature-list`,
		name: `${AI_OUTREACH_STUDIO_SEO.name} Feature Highlights`,
		description: aiOutreachFeatureDescription,
		itemListElement: AI_OUTREACH_STUDIO_FEATURES.map((feature, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: feature.title,
			description: feature.description,
			url: `${canonicalUrl}#${AI_OUTREACH_STUDIO_ANCHOR}`,
		})),
	} as const;
	return (
		<ExitIntentBoundary variant="home">
			<>
				<SchemaInjector schema={heroServiceSchema} />
				<SchemaInjector schema={aiOutreachServiceSchema} />
				<SchemaInjector schema={aiOutreachFeatureListSchema} />
				<SchemaInjector schema={activityFeedSchema} />
				<LiveDynamicHero />
				<TrustedByScroller variant="default" items={companyLogos} />
				{/* Separator for mobile only with half margin */}
				<div className="sm:hidden">
					<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
				</div>
				<ViewportLazy>
					<CallDemoShowcase />
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<>
						<FeatureSectionActivity />
						<div className="mt-12">
							<FeatureShowcase features={REAL_TIME_FEATURES} />
						</div>
					</>
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<ConnectAnythingHero />
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<CaseStudyGrid
						caseStudies={caseStudies}
						limit={3}
						showViewAllButton
						showCategoryFilter={false}
					/>
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<Testimonials
						testimonials={generalDealScaleTestimonials}
						title={"What Our Clients Say"}
						subtitle={
							"Hear from our clients about their experiences with our services"
						}
					/>
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<MarketingCatalogPricing
						title="Success-Based Pricing"
						subtitle="Pay for outcomes, not promises—pilot pricing stays locked for 2 years."
						catalog={pricingCatalog}
						showFreePreview={false}
						showUpgradeStack={false}
						showAddOnStack={false}
						showPilotBlurb={false}
					/>
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<AboutUsSection />
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<ClientBento />
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<BlogPreview title="Latest Blogs" posts={posts} />
				</ViewportLazy>
				<Separator className="mx-auto mt-16 max-w-7xl border-white/10" />
				<ViewportLazy>
					<Faq
						title="Frequently Asked Questions"
						subtitle="Find answers to common questions about our services, process, and technology expertise."
						faqItems={faqItems}
					/>
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<div className="flex items-center justify-center py-5 lg:col-span-7">
						<ContactForm />
					</div>
				</ViewportLazy>
				<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
				<ViewportLazy>
					<InstagramEmbed />
				</ViewportLazy>
			</>
		</ExitIntentBoundary>
	);
};

export default Index;
