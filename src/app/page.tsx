import AboutUsSection from "@/components/about/AboutUsSection";
import CaseStudyGrid from "@/components/case-studies/CaseStudyGrid";
import { ViewportLazy } from "@/components/common/ViewportLazy";
import ContactForm from "@/components/contact/form/ContactForm";
import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import Faq from "@/components/faq";
import { BlogPreview } from "@/components/home/BlogPreview";
import ClientBento from "@/components/home/ClientBento";
import UpcomingFeatures from "@/components/home/FeatureVote";
import Pricing from "@/components/home/Pricing";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import HeroSessionMonitorClientWithModal from "@/components/home/heros/HeroSessionMonitorClientWithModal";
import { Separator } from "@/components/ui/separator";
import { MainBentoFeatures } from "@/data/bento/main";
import { caseStudies } from "@/data/caseStudy/caseStudies";
import { faqItems } from "@/data/faq/default";
import { PricingPlans } from "@/data/service/slug_data/pricing";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
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
	const paginatedCaseStudies = paginate(
		caseStudies,
		currentPage,
		CASE_STUDY_PAGE_SIZE,
	);

	const posts = await getLatestBeehiivPosts();
	return (
		<>
			<HeroSessionMonitorClientWithModal />
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
