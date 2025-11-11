import { ViewportLazy } from "@/components/common/ViewportLazy";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import Services from "@/components/home/Services";
// Above-the-fold components (eager load for LCP)
import LiveDynamicHero from "@/components/home/heros/live-dynamic-hero-demo/page";

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
const UpcomingFeatures = dynamic(
	() => import("@/components/home/FeatureVote"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);
const Pricing = dynamic(() => import("@/components/home/Pricing"), {
	loading: () => (
		<div className="flex h-96 items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
		</div>
	),
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
	loading: () => (
		<div className="flex h-96 items-center justify-center">
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
		</div>
	),
});
import { dataModules } from "@/data/__generated__/modules";
import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { cn } from "@/lib/utils";
import type { BeehiivPost } from "@/types/behiiv";
import { SERVICE_CATEGORIES } from "@/types/service/services";

// ! TODO: Add This Section To Landing Page
// Capabilities Showcase
// Technical expertise
// Service portfolio
// Success metrics

import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/");
	return mapSeoMetaToMetadata(seo);
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
	const { caseStudies } = dataModules["caseStudy/caseStudies"];
	const { faqItems } = dataModules["faq/default"];
	const { PricingPlans } = dataModules["service/slug_data/pricing"];
	const { generalDealScaleTestimonials } =
		dataModules["service/slug_data/testimonials"];
	const { companyLogos } = dataModules["service/slug_data/trustedCompanies"];

	const paginatedCaseStudies = paginate(
		caseStudies,
		currentPage,
		CASE_STUDY_PAGE_SIZE,
	);

	const posts = await getLatestBeehiivPosts();
	return (
		<>
			<LiveDynamicHero />
			<TrustedByScroller variant="default" items={companyLogos} />
			{/* Separator for mobile only with half margin */}
			<div className="sm:hidden">
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			</div>
			<Services
				showSearch={true}
				showCategories={false}
				title="Our Comprehensive Services"
				subtitle="Tailored solutions to meet your business needs"
				showTabs={[
					SERVICE_CATEGORIES.LEAD_GENERATION,
					SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
					SERVICE_CATEGORIES.SKIP_TRACING,
					SERVICE_CATEGORIES.AI_FEATURES,
					SERVICE_CATEGORIES.REAL_ESTATE_TOOLS,
				]}
			/>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<UpcomingFeatures />
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<CaseStudyGrid
					caseStudies={caseStudies}
					limit={3}
					showViewAllButton
					showCategoryFilter={false}
				/>
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<Testimonials
					testimonials={generalDealScaleTestimonials}
					title={"What Our Clients Say"}
					subtitle={
						"Hear from our clients about their experiences with our services"
					}
				/>
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<Faq
					title="Frequently Asked Questions"
					subtitle="Find answers to common questions about our services, process, and technology expertise."
					faqItems={faqItems}
				/>
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<Pricing
					title={"Our Pricing"}
					subtitle={"Lock In Pilot Pricing For 5 Years!"}
					plans={PricingPlans}
				/>
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<AboutUsSection />
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<ClientBento />
			</ViewportLazy>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<BlogPreview title="Latest Blogs" posts={posts} />
			</ViewportLazy>
			<Separator className="mx-auto mt-16 max-w-7xl border-white/10" />
			<ViewportLazy>
				<div className="flex items-center justify-center py-5 lg:col-span-7">
					<ContactForm />
				</div>
			</ViewportLazy>
		</>
	);
};

export default Index;
