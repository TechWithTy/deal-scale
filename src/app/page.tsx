import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import { FeatureShowcase } from "@/components/demos/real-time-analytics/FeatureShowcase";
import { REAL_TIME_FEATURES } from "@/components/demos/real-time-analytics/feature-config";
import ExitIntentBoundary from "@/components/exit-intent/ExitIntentBoundary";
import { BlogPreview } from "@/components/home/BlogPreview";
import { ConnectAnythingHero } from "@/components/home/ConnectAnythingHero";
import { UploadLeadsHero } from "@/components/home/UploadLeadsHero";
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
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Separator } from "@/components/ui/separator";
import { activityStream } from "@/data/activity/activityStream";
import { caseStudies } from "@/data/caseStudy/caseStudies";
import { faqItems } from "@/data/faq/default";
import {
	AI_OUTREACH_STUDIO_ANCHOR,
	AI_OUTREACH_STUDIO_FEATURES,
	AI_OUTREACH_STUDIO_SEO,
	AI_OUTREACH_STUDIO_TAGLINE,
} from "@/data/home/aiOutreachStudio";
import { pricingCatalog } from "@/data/service/slug_data/pricing";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { exitIntentEnabled } from "@/lib/config/exitIntent";
import { cn } from "@/lib/utils";
import type { BeehiivPost } from "@/types/behiiv";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import {
	SchemaInjector,
	buildActivityFeedSchema,
	buildBlogSchema,
	buildServiceSchema,
	getTestimonialReviewData,
} from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Below-the-fold components (lazy load with dynamic imports for code splitting)
import { AboutUsSection } from "@/components/about/AboutUsSection";
const CaseStudyGrid = dynamic(
	() => import("@/components/case-studies/CaseStudyGrid"),
	{
		loading: () => <CaseStudyFallback />,
	},
);
const ContactForm = dynamic(
	() => import("@/components/contact/form/ContactForm"),
	{
		loading: () => <ContactFallback />,
	},
);
const Faq = dynamic(() => import("@/components/faq"), {
	loading: () => <FaqFallback />,
});
const ClientBento = dynamic(() => import("@/components/home/ClientBento"), {
	loading: () => <BentoFallback />,
});
const MarketingCatalogPricing = dynamic(
	() => import("@/components/pricing/CatalogPricing"),
	{
		loading: () => <PricingFallback />,
	},
);
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
	loading: () => <TestimonialFallback />,
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
		loading: () => <InstagramFallback />,
	},
);

const THREE_KEYS = ["first", "second", "third"] as const;
const FOUR_KEYS = ["alpha", "beta", "gamma", "delta"] as const;

const CaseStudyFallback = () => (
	<div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
		{THREE_KEYS.map((token) => (
			<div
				key={`case-fallback-${token}`}
				className="h-64 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/60 via-slate-900/40 to-slate-950/70 p-6 shadow-inner"
			>
				<div className="space-y-4">
					<div className="h-3 w-16 animate-pulse rounded-full bg-white/20" />
					<div className="h-5 w-2/3 animate-pulse rounded-full bg-white/30" />
					<div className="space-y-2">
						<div className="h-3 w-full animate-pulse rounded-full bg-white/15" />
						<div className="h-3 w-11/12 animate-pulse rounded-full bg-white/15" />
						<div className="h-3 w-2/3 animate-pulse rounded-full bg-white/15" />
					</div>
				</div>
			</div>
		))}
	</div>
);

const TestimonialFallback = () => (
	<div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
		{THREE_KEYS.map((token) => (
			<div
				key={`test-fallback-${token}`}
				className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-inner"
			>
				<div className="h-4 w-24 animate-pulse rounded-full bg-white/20" />
				<div className="mt-4 space-y-3">
					<div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
					<div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
					<div className="h-3 w-3/5 animate-pulse rounded-full bg-white/10" />
				</div>
			</div>
		))}
	</div>
);

const PricingFallback = () => (
	<div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
		{THREE_KEYS.map((token) => (
			<div
				key={`pricing-fallback-${token}`}
				className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15 p-6"
			>
				<div className="h-4 w-1/2 animate-pulse rounded-full bg-primary/40" />
				<div className="mt-4 h-8 w-1/3 animate-pulse rounded-full bg-primary/30" />
				<div className="mt-6 space-y-3">
					{FOUR_KEYS.map((featureToken) => (
						<div
							key={`pricing-feature-${token}-${featureToken}`}
							className="h-3 w-full animate-pulse rounded-full bg-primary/20"
						/>
					))}
				</div>
			</div>
		))}
	</div>
);

const BentoFallback = () => (
	<div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2">
		{FOUR_KEYS.map((token) => (
			<div
				key={`bento-fallback-${token}`}
				className="h-48 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-950/60"
			/>
		))}
	</div>
);

const BlogFallback = () => (
	<div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
		{THREE_KEYS.map((token) => (
			<div
				key={`blog-fallback-${token}`}
				className="rounded-3xl border border-white/10 bg-white/5 p-5 dark:bg-white/5"
			>
				<div className="h-40 w-full animate-pulse rounded-2xl bg-white/20" />
				<div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-white/40" />
				<div className="mt-2 h-3 w-full animate-pulse rounded-full bg-white/15" />
			</div>
		))}
	</div>
);

const FaqFallback = () => (
	<div className="mx-auto w-full max-w-4xl space-y-4">
		{FOUR_KEYS.map((token) => (
			<div
				key={`faq-fallback-${token}`}
				className="rounded-2xl border border-white/10 bg-slate-900/30 p-4"
			>
				<div className="h-4 w-2/3 animate-pulse rounded-full bg-white/25" />
				<div className="mt-3 h-3 w-full animate-pulse rounded-full bg-white/15" />
				<div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-white/15" />
			</div>
		))}
	</div>
);

const ContactFallback = () => (
	<div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-lg">
		<div className="grid gap-4 md:grid-cols-2">
			{FOUR_KEYS.map((token) => (
				<div
					key={`contact-field-${token}`}
					className="h-12 animate-pulse rounded-2xl bg-white/30"
				/>
			))}
		</div>
		<div className="mt-4 h-28 animate-pulse rounded-2xl bg-white/20" />
		<div className="mt-4 h-12 w-40 animate-pulse rounded-full bg-slate-900/50" />
	</div>
);

const InstagramFallback = () => (
	<div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-3">
		{THREE_KEYS.map((token) => (
			<div
				key={`insta-fallback-${token}`}
				className="aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-yellow-400/30"
			/>
		))}
	</div>
);

const SectionFallback = ({ className }: { className?: string }) => (
	<div
		className={cn(
			"flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm",
			"dark:border-white/15 dark:bg-white/5",
			className,
		)}
		aria-hidden="true"
	>
		<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
	</div>
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
	const personaPromise = `We orchestrate every deal touchpoint so ${personaAudienceLabel} stay in deal mode.`;
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
		"Automate investor deal flow, keep motivated sellers warm, and close more profitable real estate deals with Deal Scale's AI Sales Assistants.";
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
		"Automate investor deal flow, keep motivated sellers warm, and close more profitable real estate deals with Deal Scale's AI Sales Assistants.";
	const personaAudienceLabel =
		PERSONA_LABEL.replace(/^For\s+/i, "").trim() || PERSONA_LABEL;
	const personaPromise = `We orchestrate every deal touchpoint so ${personaAudienceLabel} stay in deal mode.`;
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
	const blogSchema = buildBlogSchema({
		canonicalUrl: `${canonicalUrl}/blogs`,
		name: homepageSeo.title ? `${homepageSeo.title} Blog` : "DealScale Blog",
		description:
			homepageSeo.description ??
			"DealScale's latest deep dives on AI sales assistants, automation, and real estate growth.",
		posts,
	});
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
	const shouldRenderExitIntent = exitIntentEnabled();
	const pageContent = (
		<>
			<SchemaInjector schema={heroServiceSchema} />
			<SchemaInjector schema={aiOutreachServiceSchema} />
			<SchemaInjector schema={aiOutreachFeatureListSchema} />
			<SchemaInjector schema={activityFeedSchema} />
			<SchemaInjector schema={blogSchema} />
			<LiveDynamicHero />
			<TrustedByScroller variant="default" items={companyLogos} />
			{/* Separator for mobile only with half margin */}
			<div className="sm:hidden">
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			</div>
			<SectionWrapper id="call-demo" lazy={false} fallbackLabel="Call Demo">
				<CallDemoShowcase />
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="feature-activity"
				lazy={false}
				fallbackLabel="Live Automations"
			>
				<>
					<FeatureSectionActivity />
					<div className="mt-12">
						<FeatureShowcase features={REAL_TIME_FEATURES} />
					</div>
				</>
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="connect-anything"
				lazy={false}
				fallbackLabel="Connect Any CRM"
			>
				<ConnectAnythingHero />
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="upload-leads"
				lazy={false}
				fallbackLabel="Upload Leads & Perform Actions"
			>
				<UploadLeadsHero />
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="case-studies"
				lazy={false}
				fallback={<CaseStudyFallback />}
			>
				<CaseStudyGrid
					caseStudies={caseStudies}
					limit={3}
					showViewAllButton
					showCategoryFilter={false}
				/>
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="testimonials"
				lazy={false}
				fallback={<TestimonialFallback />}
			>
				<Testimonials
					testimonials={generalDealScaleTestimonials}
					title={"What Our Clients Say"}
					subtitle={
						"Hear from our clients about their experiences with our services"
					}
				/>
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="pricing"
				rootMargin="1200px"
				fallback={<PricingFallback />}
			>
				<MarketingCatalogPricing
					title="Success-Based Pricing"
					subtitle="Pay for outcomes, not promises—pilot pricing stays locked for 2 years."
					catalog={pricingCatalog}
					showFreePreview={false}
					showUpgradeStack={false}
					showAddOnStack={false}
					showPilotBlurb={false}
				/>
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper id="about" rootMargin="1200px">
				<AboutUsSection />
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="client-bento"
				rootMargin="1200px"
				fallback={<BentoFallback />}
			>
				<ClientBento />
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="blog-preview"
				rootMargin="1200px"
				fallback={<BlogFallback />}
			>
				<BlogPreview title="Latest Blogs" posts={posts} />
			</SectionWrapper>
			<Separator className="mx-auto mt-16 max-w-7xl border-white/10" />
			<SectionWrapper id="faq" rootMargin="1200px" fallback={<FaqFallback />}>
				<Faq
					title="Frequently Asked Questions"
					subtitle="Find answers to common questions about our services, process, and technology expertise."
					faqItems={faqItems}
				/>
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="contact"
				rootMargin="1200px"
				fallback={<ContactFallback />}
			>
				<div className="flex items-center justify-center py-5 lg:col-span-7">
					<ContactForm />
				</div>
			</SectionWrapper>
			<Separator className="mx-auto my-12 max-w-7xl border-white/10" />
			<SectionWrapper
				id="instagram"
				rootMargin="1200px"
				fallback={<InstagramFallback />}
			>
				<InstagramEmbed />
			</SectionWrapper>
		</>
	);
	return shouldRenderExitIntent ? (
		<ExitIntentBoundary variant="home">{pageContent}</ExitIntentBoundary>
	) : (
		pageContent
	);
};

export default Index;
