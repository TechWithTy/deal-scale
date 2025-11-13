"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	FEATURED_FAQ_BY_PERSONA,
	PERSONA_ADVANCED_FAQ,
	PERSONA_FAQ_ITEMS,
	PERSONA_NEXT_STEP_FAQ,
	PERSONA_OPTIONS,
	type PersonaKey,
} from "@/data/faq/personaFaq";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface DynamicFaqSectionProps {
	title?: string;
	subtitle?: string;
	className?: string;
}

const DEFAULT_PERSONA: PersonaKey = "investor";

const toPersonaKey = (value: string | null): PersonaKey => {
	if (!value) {
		return DEFAULT_PERSONA;
	}

	const normalized = value.toLowerCase().trim();

	return (
		PERSONA_OPTIONS.find(({ key }) => key === normalized)?.key ??
		DEFAULT_PERSONA
	);
};

const getPersonaFromSearch = (
	params: ReturnType<typeof useSearchParams>,
): PersonaKey => toPersonaKey(params?.get("persona") ?? null);

export const DynamicFaqSection = ({
	title = "Frequently Asked Questions",
	subtitle,
	className,
}: DynamicFaqSectionProps) => {
	const searchParams = useSearchParams();
	const [persona, setPersona] = useState<PersonaKey>(() =>
		getPersonaFromSearch(searchParams),
	);

	useEffect(() => {
		const nextPersona = getPersonaFromSearch(searchParams);
		setPersona((current) => (current === nextPersona ? current : nextPersona));
	}, [searchParams]);

	const personaAdvancedFaq = PERSONA_ADVANCED_FAQ[persona];

	const faqs = useMemo(
		() =>
			PERSONA_FAQ_ITEMS.map((item) => ({
				...item,
				answer: item.answers[persona],
			})),
		[persona],
	);

	const featuredFaq = useMemo(() => {
		const featuredId = FEATURED_FAQ_BY_PERSONA[persona];
		return (
			PERSONA_FAQ_ITEMS.find((item) => item.id === featuredId) ??
			PERSONA_FAQ_ITEMS[0]
		);
	}, [persona]);

	const personaNextStep = PERSONA_NEXT_STEP_FAQ[persona];
	const personaLabel =
		PERSONA_OPTIONS.find((option) => option.key === persona)?.label ?? persona;

	return (
		<section
			className={cn(
				"mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-slate-950/30 px-6 py-10 shadow-inner shadow-slate-900/40 backdrop-blur",
				className,
			)}
		>
			<header className="text-center">
				<h2 className="font-semibold text-3xl leading-tight tracking-tight sm:text-4xl">
					{title}
				</h2>
				{subtitle ? (
					<p className="mt-2 text-muted-foreground text-sm sm:text-base">
						{subtitle}
					</p>
				) : null}
			</header>

			<div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-slate-900/50 p-3 ring-1 ring-slate-800/60">
				{PERSONA_OPTIONS.map(({ key, label }) => (
					<button
						key={key}
						type="button"
						onClick={() => setPersona(key)}
						className={cn(
							"rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
							persona === key
								? "bg-primary text-primary-foreground shadow-inner shadow-primary/35"
								: "text-muted-foreground hover:bg-primary/10",
						)}
					>
						{label}
					</button>
				))}
			</div>

			<Accordion
				type="single"
				defaultValue="featured"
				collapsible
				className="w-full"
				data-testid="featured-faq"
			>
				<AccordionItem
					value="featured"
					className="overflow-hidden rounded-3xl border border-cyan-400/60 bg-gradient-to-br from-cyan-500/30 via-blue-600/25 to-slate-950 shadow-cyan-500/25 shadow-xl transition hover:shadow-2xl"
				>
					<AccordionTrigger className="flex flex-col gap-2 px-6 py-6 text-left text-lg font-semibold text-cyan-100 sm:flex-row sm:items-center sm:justify-between">
						<span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-cyan-200/90">
							<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/70 text-sm font-bold text-slate-950">
								★
							</span>
							Featured Insight · {personaLabel}
						</span>
						<span className="text-base sm:text-lg">{featuredFaq.question}</span>
					</AccordionTrigger>
					<AccordionContent
						className="px-6 pb-6 text-base leading-relaxed text-cyan-50/95"
						data-testid="featured-faq-answer"
					>
						{featuredFaq.answers[persona]}
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Accordion
				type="single"
				collapsible
				className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
			>
				{faqs.map((faq) => (
					<AccordionItem
						key={faq.id}
						value={faq.id}
						className="group hover:-translate-y-0.5 overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900/60 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
					>
						<AccordionTrigger className="px-4 py-3 text-left font-semibold text-base text-slate-100">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-4 text-muted-foreground text-sm sm:text-base">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			{personaAdvancedFaq ? (
				<Accordion
					type="single"
					defaultValue="advanced"
					collapsible
					data-testid="persona-advanced-faq"
					className="w-full overflow-hidden rounded-3xl border border-fuchsia-400/70 bg-gradient-to-br from-fuchsia-600/45 via-purple-600/30 to-indigo-900/70 shadow-fuchsia-500/35 shadow-2xl"
				>
					<AccordionItem value="advanced">
						<AccordionTrigger className="flex flex-col gap-2 px-6 py-5 text-left font-semibold text-fuchsia-50 text-lg">
							<span className="inline-flex items-center gap-2 font-semibold text-fuchsia-200 text-xs uppercase tracking-wide">
								<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/70 font-bold text-sm">
									+
								</span>
								Advanced Playbook · {personaLabel}
							</span>
							<span className="text-base sm:text-lg">
								{personaAdvancedFaq.question}
							</span>
						</AccordionTrigger>
						<AccordionContent className="px-6 pb-6 text-base text-fuchsia-50/90 leading-relaxed">
							{personaAdvancedFaq.answer}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			) : null}

			<Accordion
				type="single"
				defaultValue="next-step"
				collapsible
				className="w-full"
				data-testid="persona-next-step"
			>
				<AccordionItem
					value="next-step"
					className="overflow-hidden rounded-2xl border border-primary/40 bg-slate-900/70 shadow-inner shadow-primary/20 transition hover:border-primary/70"
				>
					<AccordionTrigger className="px-5 py-4 text-left font-semibold text-lg text-primary-foreground">
						{personaNextStep.question}
					</AccordionTrigger>
					<AccordionContent className="px-5 pb-5 text-base text-muted-foreground leading-relaxed">
						{personaNextStep.answer}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</section>
	);
};
