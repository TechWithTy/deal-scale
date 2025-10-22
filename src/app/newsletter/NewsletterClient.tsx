"use client";
import { NewsletterEmailInput } from "@/components/contact/newsletter/NewsletterEmailInput";
import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import { BlogPreview } from "@/components/home/BlogPreview";
import ClientBento from "@/components/home/ClientBento";
import Testimonials from "@/components/home/Testimonials";
import Hero from "@/components/home/heros/Hero";
import { Separator } from "@/components/ui/separator";
import { useDataModule } from "@/stores/useDataModuleStore";
import type { BeehiivPost } from "@/types/behiiv";

export const offerImg =
	"/sales/offerings/re_investors_guide_financial_freedom.png";

// ! Newsletter landing page for user signup, incentives, and confirmation
// * Uses reusable components and follows Clean Code, DRY, and UX best practices

export default function NewsletterClient({ posts }: { posts: BeehiivPost[] }) {
        const { status: testimonialsStatus, testimonials, error: testimonialsError } =
                useDataModule(
                        "service/slug_data/testimonials",
                        ({ status, data, error }) => ({
                                status,
                                testimonials: data?.generalDealScaleTestimonials ?? [],
                                error,
                        }),
                );
        const { status: logosStatus, companyLogos, error: logosError } = useDataModule(
                "service/slug_data/trustedCompanies",
                ({ status, data, error }) => ({
                        status,
                        companyLogos: data?.companyLogos ?? {},
                        error,
                }),
        );

        const showTestimonialsLoading = testimonialsStatus === "loading" && testimonials.length === 0;
        const showTestimonialsError = testimonialsStatus === "error" && testimonials.length === 0;
        const showLogosLoading = logosStatus === "loading" && Object.keys(companyLogos).length === 0;
        const showLogosError = logosStatus === "error" && Object.keys(companyLogos).length === 0;

        if (showTestimonialsError) {
                console.error("[NewsletterClient] Failed to load testimonials", testimonialsError);
        }

        if (showLogosError) {
                console.error("[NewsletterClient] Failed to load trusted companies", logosError);
        }

        return (
                <main className="flex min-h-screen flex-col bg-background">
                        {/* ! Hero section for strong visual impact with embedded newsletter email input */}
			<Hero
				badgeLeft="Investor Insights"
				badgeRight="AI-Powered Strategies"
				headline="Get an Unfair Advantage"
				subheadline="Join our newsletter for exclusive strategies on finding off-market deals, automating seller outreach, and getting a first look at the AI tools top investors use to build their pipelines."
				highlight="in Your Market"
				ctaVariant="form"
				ctaForm={<NewsletterEmailInput />}
				image={offerImg} // Recommend updating this image to something real estate or deal-flow related
				imageAlt="An illustration of an AI agent automatically adding appointments to a calendar"
			/>
                        {showLogosError ? (
                                <div className="mx-auto my-12 max-w-5xl text-center text-destructive">
                                        Unable to load partner logos.
                                </div>
                        ) : showLogosLoading ? (
                                <div className="mx-auto my-12 max-w-5xl text-center text-muted-foreground">
                                        Loading trusted partners…
                                </div>
                        ) : (
                                <TrustedByScroller variant="secondary" items={companyLogos} />
                        )}
                        {showTestimonialsError ? (
                                <div className="mx-auto my-12 max-w-5xl text-center text-destructive">
                                        Unable to load testimonials.
                                </div>
                        ) : showTestimonialsLoading ? (
                                <div className="mx-auto my-12 max-w-5xl text-center text-muted-foreground">
                                        Loading testimonials…
                                </div>
                        ) : (
                                <Testimonials
                                        testimonials={testimonials}
                                        title={"What Our Clients Say"}
                                        subtitle={
                                                "Hear from our clients about their experiences with our services"
                                        }
                                />
                        )}
			{/* Fetch and show latest 3 Beehiiv posts */}
			{/* todo: move to a custom hook or SWR for better client caching if needed */}
			<BlogPreview title="Latest Blogs" posts={posts} />
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />

			<ClientBento />
		</main>
	);
}
