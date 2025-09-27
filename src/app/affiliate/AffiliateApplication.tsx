"use client";
import AffiliateSuccess from "@/components/affiliate/AffiliateSuccess";
import AuthGuard from "@/components/auth/AuthGuard";
import AffiliateForm from "@/components/contact/form/AffiliateForm";
import { ContactInfo } from "@/components/contact/form/ContactInfo";
import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import Testimonials from "@/components/home/Testimonials";
import {
	type AffiliateFormValues,
	affiliateFormFields,
} from "@/data/contact/affiliate";
import { discountCodes } from "@/data/discount";
import {
	affiliateProgramSteps,
	pilotProgramSteps,
} from "@/data/service/slug_data/consultationSteps";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import type { DiscountCode } from "@/types/discount/discountCode";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
// * Centralized SEO for /affiliate using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/affiliate");
	return mapSeoMetaToMetadata(seo);
}

const AffiliateApplication = () => {
	const searchParams = useSearchParams();

	const prefill = useMemo(() => {
		const result: Partial<AffiliateFormValues> = {};
		if (!searchParams) return result;
		for (const field of affiliateFormFields) {
			const name = field.name as keyof AffiliateFormValues;
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
	const [success, setSuccess] = useState(false);
	const [affiliateId, setAffiliateId] = useState<string>("");
	const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);

	// Handler to be passed to AffiliateForm
	const handleSuccess = (id: string, social: string) => {
		setAffiliateId(id);
		// Generate a unique discount code using social handle and uuid
		const codeId = uuidv4();
		// Extract handle from @handle or from a URL
		let handle = social.trim();
		if (handle.startsWith("@")) {
			handle = handle.slice(1);
		} else if (handle.startsWith("http")) {
			try {
				const url = new URL(handle);
				const path = url.pathname.split("/").filter(Boolean);
				if (path.length > 0) handle = path[path.length - 1];
			} catch {
				// fallback to original
			}
		}
		handle = handle.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
		const shortId = `${handle}-${codeId.slice(0, 6).toUpperCase()}`;
		const discountCode: DiscountCode = {
			id: shortId,
			code: shortId,
			expires: new Date("2025-12-31T23:59:59Z"),
			affiliateId: shortId,
			created: new Date(),
			maxUses: 100,
			usedCount: 0,
			discountPercent: 10,
			isActive: true,
			description: `10% off for Deal Scale affiliate referrals via ${social}`,
		};
		setAffiliateId(shortId);
		setDiscountCode(discountCode);
		setSuccess(true);
	};

	return (
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
							<AffiliateForm onSuccess={handleSuccess} prefill={prefill} />
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
};

export default AffiliateApplication;
