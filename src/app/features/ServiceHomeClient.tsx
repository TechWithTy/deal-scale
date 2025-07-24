"use client";
import BentoPage from "@/components/bento/page";
import { CTASection } from "@/components/common/CTASection";
import Header from "@/components/common/Header";
import { TechStackSection } from "@/components/common/TechStackSection";
import ServicesSection from "@/components/home/Services";
import Hero from "@/components/home/heros/Hero";
import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitor";
import HeroSessionMonitorClientWithModal from "@/components/home/heros/HeroSessionMonitorClientWithModal";
import { Separator } from "@/components/ui/separator";
import { TimelineDealScales } from "@/components/ui/timeline";
import { MainBentoFeatures } from "@/data/bento/main";
import { featureTimeline } from "@/data/features/feature_timeline";
import { leadGenIntegrations } from "@/data/service/slug_data/integrations";
import { useHasMounted } from "@/hooks/useHasMounted";
import {
	SERVICE_CATEGORIES,
	type ServiceCategoryValue,
} from "@/types/service/services";
import { useEffect, useState } from "react";

export default function ServiceHomeClient() {
	const [activeTab, setActiveTab] = useState<ServiceCategoryValue>(
		SERVICE_CATEGORIES.LEAD_GENERATION,
	);
	const hasMounted = useHasMounted();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const industry = urlParams.get("industry");
		if (
			industry &&
			(Object.values(SERVICE_CATEGORIES) as string[]).includes(industry)
		) {
			setActiveTab(industry as ServiceCategoryValue);
		}
	}, []);

	const handleIndustryChange = (value: ServiceCategoryValue) => {
		setActiveTab(value);
		window.history.replaceState(
			null,
			"",
			`${window.location.pathname}?industry=${value}`,
		);
	};

	if (!hasMounted) return null;

	return (
		<>
			{/* <HeroSessionMonitorClientWithModal /> */}

			<section className="px-6 md:py-20 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<ServicesSection
						title="Our Comprehensive Services"
						subtitle="Tailored solutions to meet your business needs"
						showTabs={[
							SERVICE_CATEGORIES.LEAD_GENERATION,
							SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
							SERVICE_CATEGORIES.SKIP_TRACING,
							SERVICE_CATEGORIES.AI_FEATURES,
							SERVICE_CATEGORIES.REAL_ESTATE_TOOLS,
						]}
						showSearch={false}
						showCategories={false}
						activeTab={activeTab}
						onTabChange={handleIndustryChange}
					/>
				</div>
			</section>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<TechStackSection
				title="Integrations"
				description="Connect Deal Scale seamlessly with your CRM, marketing tools, and workflow apps. Effortlessly sync leads, automate outreach, and streamline your pipeline with integrations trusted by top real estate professionals."
				stacks={leadGenIntegrations}
			/>
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			<BentoPage
				features={MainBentoFeatures}
				title={"Why Real Estate Leaders Choose Deal Scale"}
				subtitle={
					"We deliver a scalable and automated solution to keep your deal pipeline consistently full."
				}
			/>
			<div className="my-12">
				<Header
					title="How Deal Scales Works"
					subtitle="Here's a timeline of our journey."
				/>
				<TimelineDealScales data={featureTimeline} />
				<Separator className="my-8" />
			</div>
			<CTASection
				title="Ready to Fill Your Calendar on Autopilot?"
				description="Deal Scale is your 24/7 AI team for automated lead generation and nurturing. Let us handle the repetitive follow-ups so you can focus on high-value conversations and closing."
				buttonText="Automate My Outreach"
				href="/get-started"
			/>
		</>
	);
}
