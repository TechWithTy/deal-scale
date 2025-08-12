"use client";

import ContactForm from "@/components/contact/form/ContactForm";
import { ContactInfo } from "@/components/contact/form/ContactInfo";
import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import Testimonials from "@/components/home/Testimonials";
import { betaSignupSteps } from "@/data/service/slug_data/consultationSteps";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { betaTesterFormFields } from "@/data/contact/formFields";
import type { BetaTesterFormValues } from "@/data/contact/formFields";

// * Centralized SEO for /contact using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/contact");
	return mapSeoMetaToMetadata(seo);
}

const Contact = () => {
	const searchParams = useSearchParams();

	// Build prefill object from URL params based on field config names/types
	const prefill = useMemo(() => {
		const result: Partial<BetaTesterFormValues> = {};
		if (!searchParams) return result;

		// Build option lists for fields that need title->value mapping
		const featureVotesField = betaTesterFormFields.find(
			(f) => f.name === "featureVotes",
		);
		const wantedFeaturesField = betaTesterFormFields.find(
			(f) => f.name === "wantedFeatures",
		);
		const featureVotesOptions = Array.isArray((featureVotesField as any)?.options)
			? ((featureVotesField as any).options as { value: string; label: string }[])
			: undefined;
		const wantedFeaturesOptions = Array.isArray(
			(wantedFeaturesField as any)?.options,
		)
			? ((wantedFeaturesField as any).options as {
					value: string;
					label: string;
			  }[])
			: undefined;

		const normalize = (s: string) =>
			s
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, " ")
				.trim()
				.replace(/\s+/g, " ");

		if (featureVotesOptions) {
			console.log(
				"[ContactClient] featureVotes options:",
				featureVotesOptions.map((o) => o.label),
			);
		}
		if (wantedFeaturesOptions) {
			console.log(
				"[ContactClient] wantedFeatures options:",
				wantedFeaturesOptions.map((o) => o.label),
			);
		}

		for (const field of betaTesterFormFields) {
			const name = field.name as keyof BetaTesterFormValues;
			const raw = searchParams.get(field.name);
			if (raw == null) continue;

			switch (field.type) {
				case "multiselect": {
					let tokens = raw
						.split(",")
						.map((s) => s.trim())
						.filter((s) => s.length > 0);
					if (field.name === "featureVotes") {
						console.log("[ContactClient] featureVotes raw:", raw, tokens);
					}
					if (field.name === "wantedFeatures") {
						console.log("[ContactClient] wantedFeatures raw:", raw, tokens);
					}

					const mapWithOptions = (
						arr: string[],
						options?: { value: string; label: string }[],
					) => {
						if (!options) return arr;
						return arr
							.map((t) => {
								const direct = options.find((opt) => opt.value === t);
								if (direct) return t;
								const norm = normalize(t);
								const byLabel = options.find(
									(opt) => normalize(opt.label) === norm,
								);
								if (byLabel) return byLabel.value;
								const byContains = options.find((opt) =>
									normalize(opt.label).includes(norm),
								);
								if (byContains) return byContains.value;
								// fuzzy token-overlap
								const normTokens = new Set(norm.split(" ").filter(Boolean));
								let best: { val: string; score: number } | null = null;
								for (const opt of options) {
									const labelNorm = normalize(opt.label);
									const labelTokens = new Set(
										labelNorm.split(" ").filter(Boolean),
									);
									let overlap = 0;
									for (const tk of normTokens)
										if (labelTokens.has(tk)) overlap++;
									const denom = Math.max(
										normTokens.size,
										labelTokens.size,
									) || 1;
									const score = overlap / denom;
									if (!best || score > best.score)
										best = { val: opt.value, score };
								}
								if (best && best.score >= 0.5) return best.val;
								return t;
							})
							.filter((t) => t.length > 0);
					};

					if (field.name === "featureVotes") {
						tokens = mapWithOptions(tokens, featureVotesOptions);
						console.log("[ContactClient] featureVotes mapped:", tokens);
					} else if (field.name === "wantedFeatures") {
						tokens = mapWithOptions(tokens, wantedFeaturesOptions);
						console.log("[ContactClient] wantedFeatures mapped:", tokens);
					}

					(result[name] as unknown) = tokens;
					break;
				}
				case "checkbox": {
					// Accept true/1/yes/on
					const val = /^(true|1|yes|on)$/i.test(raw);
					(result[name] as unknown) = val;
					break;
				}
				case "file": {
					// Not supported via URL
					break;
				}
				default: {
					(result[name] as unknown) = raw as never;
				}
			}
		}

		return result;
	}, [searchParams]);
	return (
		<>
			<div className="container mx-auto px-6 py-24">
				<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<ContactForm prefill={prefill} />
					</div>
					<div className="flex flex-col lg:col-span-5">
						<ScheduleMeeting />
						<ContactSteps steps={betaSignupSteps} />
						<TrustedByMarquee items={companyLogos} />
						{/* <div className="relative w-full mt-10 overflow-hidden py-4 text-center bg-background-dark/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm animate-float">
              <Image
                src="/CyberOni-Wording_white.png"
                alt="CyberOni Logo"
                width={300}
                height={76}
                className="mx-auto glow-outline"
              />
            </div> */}
					</div>
				</div>
				<ContactInfo />

				<Testimonials
					testimonials={generalDealScaleTestimonials}
					title={"What Our Clients Say"}
					subtitle={
						"Hear from our clients about their experiences with our services"
					}
				/>
				<Newsletter />
			</div>
		</>
	);
};

export default Contact;
