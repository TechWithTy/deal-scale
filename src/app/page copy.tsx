// import { ContactForm } from "@/components/contact/form/ContactForm";
// import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
// import Faq from "@/components/faq";
// import { BlogPreview } from "@/components/home/BlogPreview";
// import ClientBento from "@/components/home/ClientBento";
// import UpcomingFeatures from "@/components/home/FeatureVote";
// import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitorClient";
// import Pricing from "@/components/home/Pricing";
// import Projects from "@/components/home/Projects";
// import Services from "@/components/home/Services";
// import Testimonials from "@/components/home/Testimonials";
// import { Separator } from "@/components/ui/separator";
// import { MainBentoFeatures } from "@/data/bento/main";
// import { faqItems } from "@/data/faq/default";
// import { dealScalePricingPlans } from "@/data/service/slug_data/pricing";
// import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
// import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
// import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
// import type { BeehiivPost } from "@/types/behiiv";
// import { SERVICE_CATEGORIES } from "@/types/service/services";

// // ! TODO: Add This Section To Landing Page
// // Capabilities Showcase
// // Technical expertise
// // Service portfolio
// // Success metrics

// import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
// import { getStaticSeo } from "@/utils/seo/staticSeo";
// import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
// 	const seo = getStaticSeo("/");
// 	return mapSeoMetaToMetadata(seo);
// }

// const Index = async () => {
// 	const posts = await getLatestBeehiivPosts();
// 	return (
// 		<>
// 			<HeroSessionMonitor />
// 			<TrustedByScroller variant="default" items={companyLogos} />
// 			{/* Separator for mobile only with half margin */}
// 			<div className="sm:hidden">
// 				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
// 			</div>

// 			<Services
// 				showSearch={true}
// 				showCategories={false}
// 				title="Our Comprehensive Services"
// 				subtitle="Tailored solutions to meet your business needs"
// 				showTabs={[
// 					SERVICE_CATEGORIES.LEAD_GENERATION,
// 					SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
// 					SERVICE_CATEGORIES.SKIP_TRACING,
// 					SERVICE_CATEGORIES.AI_FEATURES,
// 					SERVICE_CATEGORIES.REAL_ESTATE_TOOLS,
// 				]}
// 			/>
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
// 			<UpcomingFeatures />
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />

// 			<Projects />
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
// 			<Testimonials
// 				testimonials={generalDealScaleTestimonials}
// 				title={"What Our Clients Say"}
// 				subtitle={
// 					"Hear from our clients about their experiences with our services"
// 				}
// 			/>
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
// 			<Faq
// 				title="Frequently Asked Questions"
// 				subtitle="Find answers to common questions about our services, process, and technology expertise."
// 				faqItems={faqItems}
// 			/>
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
// 			<Pricing
// 				title={"Our Pricing"}
// 				subtitle={"Lock In Pilot Pricing For 5 Years!"}
// 				plans={dealScalePricingPlans}
// 			/>
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
// 			<ClientBento />
// 			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />

// 			<BlogPreview title="Latest Blogs" posts={posts} />
// 			<Separator className="mx-auto mt-16 max-w-7xl border-white/10" />

// 			<div className="flex items-center justify-center py-5 lg:col-span-7">
// 				<ContactForm />
// 			</div>
// 		</>
// 	);
// };

// export default Index;
