"use client";
import AffiliateApplicationForm from "@/components/affiliate/AffiliateApplicationForm";
import AffiliateApplicationSuccess from "@/components/affiliate/AffiliateApplicationSuccess";
import AuthGuard from "@/components/auth/AuthGuard";
import { ContactInfo } from "@/components/contact/form/ContactInfo";
import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import ExitIntentBoundary from "@/components/exit-intent/ExitIntentBoundary";
import Testimonials from "@/components/home/Testimonials";
import {
	type AffiliateApplicationValues,
	affiliateApplicationFields,
} from "@/data/contact/affiliate";
import { affiliateProgramSteps } from "@/data/service/slug_data/consultationSteps";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { exitIntentEnabled } from "@/lib/config/exitIntent";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
// * Centralized SEO for /affiliate using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/affiliate");
	return mapSeoMetaToMetadata(seo);
}

const AffiliateApplication = () => {
	const searchParams = useSearchParams();

	const prefill = useMemo(() => {
		const result: Partial<AffiliateApplicationValues> = {};
		if (!searchParams) return result;
		// Only prefill Step 1 (application) fields, not payment fields
		for (const field of affiliateApplicationFields) {
			const name = field.name as keyof AffiliateApplicationValues;
			const raw = searchParams.get(field.name);
			if (raw == null) continue;
			switch (field.type) {
				case "multiselect": {
					(result[name] as unknown) = raw
						.split(",")
						.map((s) => s.trim())
						.filter((s) => s.length > 0);
					break;
				}
				case "checkbox": {
					(result[name] as unknown) = /^(true|1|yes|on)$/i.test(raw);
					break;
				}
				case "file": {
					// Not supported via URL
					break;
				}
				default: {
					(result[name] as unknown) = raw;
				}
			}
		}
		return result;
	}, [searchParams]);
	const [applicationSubmitted, setApplicationSubmitted] = useState(false);

	// Handler to be passed to AffiliateApplicationForm
	const handleSuccess = () => {
		setApplicationSubmitted(true);
	};

	const shouldRenderExitIntent = exitIntentEnabled();

	const content = (
		<AuthGuard>
			<div className="container mx-auto px-6 py-24">
				<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-7">
						{applicationSubmitted ? (
							<AffiliateApplicationSuccess />
						) : (
							<AffiliateApplicationForm
								onSuccess={handleSuccess}
								prefill={prefill}
							/>
						)}
					</div>
					<div className="flex flex-col lg:col-span-5">
						<ScheduleMeeting />
						<ContactSteps steps={affiliateProgramSteps} />
						<TrustedByMarquee items={companyLogos} />
					</div>
				</div>
				<ContactInfo />
				<Testimonials
					testimonials={generalDealScaleTestimonials}
					title={"What Our Affiliates Say"}
					subtitle={
						"Hear from affiliates and partners about their experience with Deal Scale"
					}
				/>
				<Newsletter />
			</div>
		</AuthGuard>
	);

	return shouldRenderExitIntent ? (
		<ExitIntentBoundary variant="affiliate">{content}</ExitIntentBoundary>
	) : (
		content
	);
};

export default AffiliateApplication;
