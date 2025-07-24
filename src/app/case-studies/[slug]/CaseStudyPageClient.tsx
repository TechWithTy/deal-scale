"use client";

import BentoPage from "@/components/bento/page";
import { CaseStudyBusinessOutcome } from "@/components/case-studies/CaseStudyBusinessOutcome";
import CaseStudyContent from "@/components/case-studies/CaseStudyContent";
import CaseStudyDetailHeader from "@/components/case-studies/CaseStudyDetailHeader";
import RelatedCaseStudies from "@/components/case-studies/RelatedCaseStudies";
import { CTASection } from "@/components/common/CTASection";
import { SEOWrapper } from "@/components/common/SEOWrapper";
import { TechStackSection } from "@/components/common/TechStackSection";
import Testimonials from "@/components/home/Testimonials";
import { PageLayout } from "@/components/layout/PageLayout";
import { FlowChart } from "@/components/services/HowItWorks";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import { MainBentoFeatures } from "@/data/bento/main";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { getCaseStudySeo } from "@/utils/seo/seo";
import { useEffect, useState } from "react";

import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitor";
import HowItWorksCarousel from "@/components/services/HowItWorksCarousel";
import type { CaseStudy } from "@/lib/caseStudies/case-studies";

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
				<BentoPage
					features={MainBentoFeatures}
					title={"Why Real Estate Leaders Choose Deal Scale"}
					subtitle={
						"We deliver a scalable and automated solution to keep your deal pipeline consistently full."
					}
				/>
				{relatedCaseStudies.length > 0 && (
					<RelatedCaseStudies studies={relatedCaseStudies} />
				)}
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
				{/* <TechStackSection
          title="Technologies Used"
          description="The cutting-edge tech stack that powered this solution"
          stacks={caseStudy.techStacks}
        /> */}
				<Testimonials
					testimonials={generalDealScaleTestimonials}
					title={"What Our Clients Say"}
					subtitle={
						"Hear from our clients about their experiences with our services"
					}
				/>
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
