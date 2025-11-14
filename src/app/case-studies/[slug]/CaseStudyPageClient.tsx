"use client";

import BentoPage from "@/components/bento/page";
import { CaseStudyBusinessOutcome } from "@/components/case-studies/CaseStudyBusinessOutcome";
import CaseStudyContent from "@/components/case-studies/CaseStudyContent";
import CaseStudyDetailHeader from "@/components/case-studies/CaseStudyDetailHeader";
import RelatedCaseStudies from "@/components/case-studies/RelatedCaseStudies";
import { CTASection } from "@/components/common/CTASection";
import { SEOWrapper } from "@/components/common/SEOWrapper";
import Testimonials from "@/components/home/Testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import { useDataModuleGuardTelemetry } from "@/hooks/useDataModuleGuardTelemetry";
import { useDataModule } from "@/stores/useDataModuleStore";
import { getCaseStudySeo } from "@/utils/seo/seo";
import { useEffect, useMemo, useState } from "react";

import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitor";
import HowItWorksCarousel from "@/components/services/HowItWorksCarousel";
import type { CaseStudy } from "@/lib/caseStudies/case-studies";
import type { BentoFeature } from "@/types/bento/features";
import type { Testimonial } from "@/types/testimonial";

interface CaseStudyPageClientProps {
	caseStudy: CaseStudy | null;
	relatedCaseStudies: CaseStudy[];
}

export default function CaseStudyPageClient({
	caseStudy,
	relatedCaseStudies,
}: CaseStudyPageClientProps): JSX.Element {
	const [canonicalUrl, setCanonicalUrl] = useState<string | undefined>(
		undefined,
	);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setCanonicalUrl(window.location.href);
		}
	}, []);

	// Always render SEO for SSR/CSR safety, fallback to default SEO if caseStudy is not loaded
	const seoMeta = caseStudy ? getCaseStudySeo(caseStudy) : undefined;

	if (!caseStudy) {
		return (
			<>
				<SEOWrapper />
				Case study not found
			</>
		);
	}

	const {
		status: featureStatus,
		features: bentoFeatures,
		error: featureError,
	} = useDataModule("bento/main", ({ status, data, error }) => ({
		status,
		features: (data?.MainBentoFeatures ?? []) as BentoFeature[],
		error,
	}));
	const {
		status: testimonialStatus,
		testimonials: moduleTestimonials,
		error: testimonialError,
	} = useDataModule(
		"service/slug_data/testimonials",
		({ status, data, error }) => ({
			status,
			testimonials: (data?.generalDealScaleTestimonials ?? []) as Testimonial[],
			error,
		}),
	);

	const hasBentoFeatures = bentoFeatures.length > 0;
	const hasTestimonials = moduleTestimonials.length > 0;

	const featureDetail = useMemo(
		() => ({ segment: "bento", slug: caseStudy.slug }),
		[caseStudy.slug],
	);
	const testimonialDetail = useMemo(
		() => ({ segment: "testimonials", slug: caseStudy.slug }),
		[caseStudy.slug],
	);

	useDataModuleGuardTelemetry({
		key: "bento/main",
		surface: "CaseStudyPageClient",
		status: featureStatus,
		hasData: hasBentoFeatures,
		error: featureError,
		detail: featureDetail,
	});

	useDataModuleGuardTelemetry({
		key: "service/slug_data/testimonials",
		surface: "CaseStudyPageClient",
		status: testimonialStatus,
		hasData: hasTestimonials,
		error: testimonialError,
		detail: testimonialDetail,
	});

	useEffect(() => {
		if (featureStatus === "error") {
			console.error(
				"[CaseStudyPageClient] Failed to load highlights",
				featureError,
			);
		}
	}, [featureError, featureStatus]);

	useEffect(() => {
		if (testimonialStatus === "error") {
			console.error(
				"[CaseStudyPageClient] Failed to load testimonials",
				testimonialError,
			);
		}
	}, [testimonialStatus, testimonialError]);

	const isFeatureLoading =
		featureStatus === "idle" || featureStatus === "loading";
	const isFeatureError = featureStatus === "error";
	const isTestimonialLoading =
		testimonialStatus === "idle" || testimonialStatus === "loading";
	const isTestimonialError = testimonialStatus === "error";

	// Defensive utility to ensure only strings are rendered
	function safeText(val: unknown): string {
		if (typeof val === "string") return val;
		if (val instanceof Error) return val.message;
		return String(val ?? "");
	}

	return (
		<>
			<SEOWrapper {...seoMeta} canonical={canonicalUrl} />
			<div className="my-10">
				<CaseStudyDetailHeader caseStudy={caseStudy} />

				<CaseStudyContent caseStudy={caseStudy} />
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
				<CaseStudyBusinessOutcome caseStudy={caseStudy} />
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
				<section className="container">
					<SectionHeading centered title="How It Works" />
					<div className="mt-8">
						<HowItWorksCarousel howItWorks={caseStudy.howItWorks} />
					</div>
				</section>
				{isFeatureError ? (
					<div className="my-12 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive-foreground">
						Unable to load highlights right now.
					</div>
				) : isFeatureLoading ? (
					<div className="my-12 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
						Loading highlights…
					</div>
				) : hasBentoFeatures ? (
					<BentoPage
						features={bentoFeatures}
						title={"Why Real Estate Leaders Choose Deal Scale"}
						subtitle={
							"We deliver a scalable and automated solution to keep your deal pipeline consistently full."
						}
					/>
				) : (
					<div className="my-12 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
						Highlights coming soon.
					</div>
				)}
				{relatedCaseStudies.length > 0 && (
					<RelatedCaseStudies studies={relatedCaseStudies} />
				)}
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
				{/* <TechStackSection
          title="Technologies Used"
          description="The cutting-edge tech stack that powered this solution"
          stacks={caseStudy.techStacks}
        /> */}
				{isTestimonialError ? (
					<div className="my-12 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive-foreground">
						Unable to load testimonials right now.
					</div>
				) : isTestimonialLoading ? (
					<div className="my-12 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
						Loading testimonials…
					</div>
				) : hasTestimonials ? (
					<Testimonials
						testimonials={moduleTestimonials}
						title={"What Our Clients Say"}
						subtitle={
							"Hear from our clients about their experiences with our services"
						}
					/>
				) : (
					<div className="my-12 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
						Testimonials coming soon.
					</div>
				)}
				<CTASection
					title={caseStudy.copyright.title}
					description={caseStudy.copyright.subtitle}
					buttonText={caseStudy.copyright.ctaText}
					href={caseStudy.copyright.ctaLink}
				/>
			</div>
		</>
	);
}
