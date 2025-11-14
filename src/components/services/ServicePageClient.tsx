"use client";

import BentoPage from "@/components/bento/page";
import { CTASection } from "@/components/common/CTASection";
import { TechStackSection } from "@/components/common/TechStackSection";
import Faq from "@/components/faq";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import { BusinessChallenge } from "@/components/services/BusinessChallenge";
import { FlowChart } from "@/components/services/HowItWorks";
import HowItWorksCarousel from "@/components/services/HowItWorksCarousel";
import ServiceHero from "@/components/services/ServiceHero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import { MainBentoFeatures } from "@/data/bento/main";
import type { ServiceItemData } from "@/types/service/services";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ServicePageClientProps {
	service: ServiceItemData | null;
}

const ServicePageClient: React.FC<ServicePageClientProps> = ({ service }) => {
	if (!service) {
		return <div>Service not found</div>;
	}

	const { slugDetails, title } = service;

	return (
		<>
			<ServiceHero
				title={title}
				subtitle={slugDetails.copyright.subtitle}
				splineUrl={slugDetails.splineUrl?.splineUrl}
				defaultZoom={slugDetails.defaultZoom}
			/>
			<BusinessChallenge problemSolutions={slugDetails.problemsAndSolutions} />
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<section className="container">
				<SectionHeading centered title="How It Works" />
				<div className="mt-8">
					<HowItWorksCarousel howItWorks={slugDetails.howItWorks} />
				</div>
			</section>
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			{slugDetails.testimonials && slugDetails.testimonials.length > 0 && (
				<section className="container">
					<Testimonials
						testimonials={slugDetails.testimonials}
						title={title}
						subtitle={slugDetails.copyright.subtitle}
					/>
				</section>
			)}
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			<Faq
				title="Frequently Asked Questions"
				subtitle="Find answers to common questions about our services, process, and technology expertise."
				faqItems={slugDetails.faq.faqItems}
			/>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<BentoPage
				features={MainBentoFeatures}
				title="Why Real Estate Leaders Choose Deal Scale"
				subtitle="We deliver a scalable and automated solution to keep your deal pipeline consistently full."
			/>
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			<section className="container">
				<Pricing
					title={title}
					subtitle={slugDetails.copyright.subtitle}
					plans={slugDetails.pricing}
				/>
			</section>
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			<TechStackSection
				title={`${title.split(" ").slice(0, 2).join(" ")} Tech Stack`}
				description={`Cutting-edge technologies that power our ${title.toLowerCase()} solutions.`}
				stacks={slugDetails.integrations}
			/>
			<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
			<CTASection
				title={slugDetails.copyright.title}
				description={slugDetails.copyright.subtitle}
				buttonText="Get Started"
				href="/contact"
			/>
		</>
	);
};

export default ServicePageClient;
