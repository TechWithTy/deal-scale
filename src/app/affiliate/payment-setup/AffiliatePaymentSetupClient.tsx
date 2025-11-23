"use client";

import AffiliatePaymentForm from "@/components/affiliate/AffiliatePaymentForm";
import AffiliateSuccess from "@/components/affiliate/AffiliateSuccess";
import AuthGuard from "@/components/auth/AuthGuard";
import { ContactInfo } from "@/components/contact/form/ContactInfo";
import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import ExitIntentBoundary from "@/components/exit-intent/ExitIntentBoundary";
import Testimonials from "@/components/home/Testimonials";
import { affiliateProgramSteps } from "@/data/service/slug_data/consultationSteps";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { exitIntentEnabled } from "@/lib/config/exitIntent";
import type { DiscountCode } from "@/types/discount/discountCode";
import { useState } from "react";

export default function AffiliatePaymentSetupClient() {
	const [success, setSuccess] = useState(false);
	const [affiliateId, setAffiliateId] = useState<string>("");
	const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);

	const shouldRenderExitIntent = exitIntentEnabled();

	const content = (
		<AuthGuard>
			<div className="container mx-auto px-6 py-24">
				<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-7">
						{success && discountCode ? (
							<AffiliateSuccess
								affiliateId={affiliateId || "AFFILIATE-12345"}
								discountCode={discountCode}
							/>
						) : (
							<AffiliatePaymentForm
								onSuccess={(id, code) => {
									setAffiliateId(id);
									setDiscountCode(code);
									setSuccess(true);
								}}
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
}


