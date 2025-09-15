"use client";

import { ContactInfo } from "@/components/contact/form/ContactInfo";
import ContactPilotForm from "@/components/contact/form/ContactPilotForm";
import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import Testimonials from "@/components/home/Testimonials";
import { pilotProgramSteps } from "@/data/service/slug_data/consultationSteps";
import { generalDealScaleTestimonials } from "@/data/service/slug_data/testimonials";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { priorityPilotFormFields } from "@/data/contact/pilotFormFields";
import type { PriorityPilotFormValues } from "@/data/contact/pilotFormFields";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

const Contact = () => {
	const searchParams = useSearchParams();

	const prefill = useMemo(() => {
		const result: Partial<PriorityPilotFormValues> = {};
		if (!searchParams) return result;
		// Access options for featureVotes to map human-readable titles to values
		const featureVotesField = priorityPilotFormFields.find(
			(f) => f.name === "featureVotes",
		);
		const featureVotesOptions = Array.isArray(
			(featureVotesField as any)?.options,
		)
			? ((featureVotesField as any).options as {
					value: string;
					label: string;
				}[])
			: undefined;
		const normalize = (s: string) =>
			s
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, " ") // strip punctuation
				.trim()
				.replace(/\s+/g, " "); // collapse spaces
		if (featureVotesOptions) {
			console.log(
				"[ContactClientPilot] featureVotes options:",
				featureVotesOptions.map((o) => o.label),
			);
		}

		for (const field of priorityPilotFormFields) {
			const name = field.name as keyof PriorityPilotFormValues;
			const raw = searchParams.get(field.name);
			if (raw == null) continue;
			switch (field.type) {
				case "multiselect": {
					let tokens = raw
						.split(",")
						.map((s) => s.trim())
						.filter((s) => s.length > 0);
					if (field.name === "featureVotes") {
						console.log("[ContactClientPilot] featureVotes raw:", raw, tokens);
					}
					// If this is the featureVotes field, map labels to values so titles work in URL
					if (field.name === "featureVotes" && featureVotesOptions) {
						tokens = tokens
							.map((t) => {
								// if already a value (id), keep it
								const direct = featureVotesOptions.find(
									(opt) => opt.value === t,
								);
								if (direct) return t;
								// try to map by label (case-insensitive)
								const norm = normalize(t);
								const byLabel = featureVotesOptions.find(
									(opt) => normalize(opt.label) === norm,
								);
								if (byLabel) return byLabel.value;
								// fallback: substring/contains match (case-insensitive)
								const byContains = featureVotesOptions.find((opt) =>
									normalize(opt.label).includes(norm),
								);
								if (byContains) return byContains.value;
								// fuzzy: token-overlap best match
								const normTokens = new Set(norm.split(" ").filter(Boolean));
								let best: { val: string; score: number } | null = null;
								for (const opt of featureVotesOptions) {
									const labelNorm = normalize(opt.label);
									const labelTokens = new Set(
										labelNorm.split(" ").filter(Boolean),
									);
									let overlap = 0;
									for (const tk of normTokens)
										if (labelTokens.has(tk)) overlap++;
									const denom =
										Math.max(normTokens.size, labelTokens.size) || 1;
									const score = overlap / denom;
									if (!best || score > best.score)
										best = { val: opt.value, score };
								}
								if (best && best.score >= 0.5) return best.val;
								return t; // fallback to raw if no reasonable match
							})
							.filter((t) => t.length > 0);
						console.log("[ContactClientPilot] featureVotes mapped:", tokens);
					}
					(result[name] as unknown) = tokens;
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

	return (
		<>
			<div className="container mx-auto px-6 py-24">
				<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<ContactPilotForm prefill={prefill} />
					</div>
					<div className="flex flex-col lg:col-span-5">
						<ScheduleMeeting />
						<ContactSteps steps={pilotProgramSteps} />
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
