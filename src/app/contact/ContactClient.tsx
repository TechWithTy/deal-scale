"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import ExitIntentBoundary from "@/components/exit-intent/ExitIntentBoundary";
import ContactForm from "@/components/contact/form/ContactForm";
import { ContactInfo } from "@/components/contact/form/ContactInfo";
import {
	type ContactStep,
	ContactSteps,
} from "@/components/contact/form/ContactSteps";
import { Newsletter } from "@/components/contact/newsletter/Newsletter";
import { ScheduleMeeting } from "@/components/contact/schedule/ScheduleMeeting";
import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import Testimonials from "@/components/home/Testimonials";
import { betaTesterFormFields } from "@/data/contact/formFields";
import type { BetaTesterFormValues } from "@/data/contact/formFields";
import { useDataModule } from "@/stores/useDataModuleStore";
import type { MultiselectField } from "@/types/contact/formFields";
import type { CompanyLogoDictType } from "@/types/service/trusted-companies";
import type { Testimonial } from "@/types/testimonial";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { exitIntentEnabled } from "@/lib/config/exitIntent";

import { useDataModuleGuardTelemetry } from "@/hooks/useDataModuleGuardTelemetry";

// * Centralized SEO for /contact using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/contact");
	return mapSeoMetaToMetadata(seo);
}

const Contact = () => {
	const searchParams = useSearchParams();
	const { data: session } = useSession();

	const profilePrefill = useMemo<Partial<BetaTesterFormValues>>(() => {
		const user = session?.user;
		if (!user) {
			return {};
		}
		const name = user.name?.trim() ?? "";
		let firstName: string | undefined;
		let lastName: string | undefined;
		if (name.length > 0) {
			const [first, ...rest] = name.split(/\s+/);
			firstName = first || undefined;
			lastName = rest.length > 0 ? rest.join(" ") : undefined;
		}
		const phone = (user as { phone?: string }).phone;
		return {
			firstName,
			lastName,
			email: user.email ?? undefined,
			phone: phone ?? undefined,
		};
	}, [session]);

	// Build prefill object from URL params based on field config names/types
	const prefill = useMemo(() => {
		const result: Partial<BetaTesterFormValues> = {};
		if (!searchParams) return result;

		// Build option lists for fields that need title->value mapping
		const featureVotesField = betaTesterFormFields.find(
			(field): field is MultiselectField =>
				field.name === "featureVotes" && field.type === "multiselect",
		);
		const wantedFeaturesField = betaTesterFormFields.find(
			(field): field is MultiselectField =>
				field.name === "wantedFeatures" && field.type === "multiselect",
		);
		const featureVotesOptions = featureVotesField?.options;
		const wantedFeaturesOptions = wantedFeaturesField?.options;

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
									const denom =
										Math.max(normTokens.size, labelTokens.size) || 1;
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

		return { ...result, ...profilePrefill };
	}, [searchParams, profilePrefill]);
	const {
		status: logosStatus,
		companyLogos,
		error: logosError,
	} = useDataModule(
		"service/slug_data/trustedCompanies",
		({ status, data, error }) => ({
			status,
			companyLogos: (data?.companyLogos ?? {}) as CompanyLogoDictType,
			error,
		}),
	);
	const {
		status: testimonialsStatus,
		testimonials,
		error: testimonialsError,
	} = useDataModule(
		"service/slug_data/testimonials",
		({ status, data, error }) => ({
			status,
			testimonials: (data?.generalDealScaleTestimonials ?? []) as Testimonial[],
			error,
		}),
	);
	const {
		status: stepsStatus,
		steps,
		error: stepsError,
	} = useDataModule(
		"service/slug_data/consultationSteps",
		({ status, data, error }) => ({
			status,
			steps: (data?.betaSignupSteps ?? []) as ContactStep[],
			error,
		}),
	);

	const logosDetail = useMemo(() => ({ segment: "trusted-companies" }), []);
	const testimonialsDetail = useMemo(() => ({ segment: "testimonials" }), []);
	const stepsDetail = useMemo(() => ({ segment: "consultation-steps" }), []);

	const isLogosLoading = logosStatus === "idle" || logosStatus === "loading";
	const isLogosError = logosStatus === "error";
	const hasLogos = Object.keys(companyLogos).length > 0;

	const isTestimonialsLoading =
		testimonialsStatus === "idle" || testimonialsStatus === "loading";
	const isTestimonialsError = testimonialsStatus === "error";
	const hasTestimonials = testimonials.length > 0;

	const isStepsLoading = stepsStatus === "idle" || stepsStatus === "loading";
	const isStepsError = stepsStatus === "error";
	const hasSteps = steps.length > 0;

	useDataModuleGuardTelemetry({
		key: "service/slug_data/trustedCompanies",
		surface: "ContactClient",
		status: logosStatus,
		hasData: hasLogos,
		error: logosError,
		detail: logosDetail,
	});

	useDataModuleGuardTelemetry({
		key: "service/slug_data/testimonials",
		surface: "ContactClient",
		status: testimonialsStatus,
		hasData: hasTestimonials,
		error: testimonialsError,
		detail: testimonialsDetail,
	});

	useDataModuleGuardTelemetry({
		key: "service/slug_data/consultationSteps",
		surface: "ContactClient",
		status: stepsStatus,
		hasData: hasSteps,
		error: stepsError,
		detail: stepsDetail,
	});

	if (isLogosError) {
		console.error(
			"[ContactClient] Failed to load trusted companies",
			logosError,
		);
	}

	if (isTestimonialsError) {
		console.error(
			"[ContactClient] Failed to load testimonials",
			testimonialsError,
		);
	}

	if (isStepsError) {
		console.error(
			"[ContactClient] Failed to load consultation steps",
			stepsError,
		);
	}

	const shouldRenderExitIntent = exitIntentEnabled();

	const content = (
		<AuthGuard>
			<div className="container mx-auto px-6 py-24">
				<div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<ContactForm prefill={prefill} />
					</div>
					<div className="flex flex-col lg:col-span-5">
						<ScheduleMeeting />
						{isStepsError ? (
							<div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive-foreground">
								Unable to load next steps right now.
							</div>
						) : isStepsLoading ? (
							<div className="mt-6 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
								Loading next steps…
							</div>
						) : hasSteps ? (
							<ContactSteps steps={steps} />
						) : (
							<div className="mt-6 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
								Next steps coming soon.
							</div>
						)}
						{isLogosError ? (
							<div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive-foreground">
								Unable to load trusted partners right now.
							</div>
						) : isLogosLoading ? (
							<div className="mt-6 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
								Loading trusted partners…
							</div>
						) : hasLogos ? (
							<TrustedByMarquee items={companyLogos} />
						) : (
							<div className="mt-6 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
								Trusted partners coming soon.
							</div>
						)}
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

				{isTestimonialsError ? (
					<div className="my-12 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive-foreground">
						Unable to load testimonials right now.
					</div>
				) : isTestimonialsLoading ? (
					<div className="my-12 rounded-xl border border-white/10 bg-background-dark/50 p-6 text-center text-muted-foreground">
						Loading testimonials…
					</div>
				) : hasTestimonials ? (
					<Testimonials
						testimonials={testimonials}
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
				<Newsletter />
			</div>
		</AuthGuard>
	);

	return shouldRenderExitIntent ? (
		<ExitIntentBoundary variant="contact">{content}</ExitIntentBoundary>
	) : (
		content
	);
};

export default Contact;
