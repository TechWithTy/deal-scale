import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Fragment, useMemo } from "react";
import type { ProductSummaryProps } from "./types";

const copyFields = ["pain_point", "fear", "hope", "solution"] as const;

type CopyField = (typeof copyFields)[number];
type InsightKey = "fear" | "hope" | "pain_point" | "solution";

const extractCopyField = (
	field: CopyField,
	abTest?: ProductSummaryProps["abTest"],
) => {
	if (!abTest) return undefined;

	for (const variant of abTest.variants ?? []) {
		const value = variant.copy?.[field];
		if (typeof value === "string" && value.trim().length > 0) {
			return value.trim();
		}
	}

	return undefined;
};

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildIcon = (
	titleText: string,
	className: string,
	paths: JSX.Element[],
) => (
	<span role="img" aria-label={titleText} className="inline-flex">
		<svg
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<title>{titleText}</title>
			{paths}
		</svg>
	</span>
);

const insightAccents: Record<
	InsightKey,
	{
		label: string;
		icon: JSX.Element;
		trigger: string;
		content: string;
	}
> = {
	fear: {
		label: "Fear Signal",
		icon: buildIcon("Fear signal", "h-4 w-4 text-red-400", [
			<path
				key="fear-x"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m12 9.5 2 2m-2 0 2-2M9 15h6"
			/>,
			<path
				key="fear-outline"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7Z"
			/>,
		]),
		trigger:
			"px-4 text-left text-sm font-semibold uppercase tracking-wide text-red-200 data-[state=open]:bg-red-950/60",
		content: "px-4 text-sm leading-relaxed text-red-100",
	},
	hope: {
		label: "Hope Moment",
		icon: buildIcon("Hope moment", "h-4 w-4 text-sky-400", [
			<path
				key="hope-hand"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6v6l3 3"
			/>,
			<path
				key="hope-circle"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>,
		]),
		trigger:
			"px-4 text-left text-sm font-semibold uppercase tracking-wide text-sky-200 data-[state=open]:bg-sky-950/40",
		content: "px-4 text-sm leading-relaxed text-sky-100",
	},
	pain_point: {
		label: "Problem",
		icon: buildIcon("Problem insight", "h-4 w-4 text-amber-400", [
			<path
				key="pain-exclamation"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 9v4m0 4h.01"
			/>,
			<path
				key="pain-circle"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>,
		]),
		trigger:
			"px-4 text-left text-sm font-semibold uppercase tracking-wide text-amber-200 data-[state=open]:bg-amber-950/40",
		content: "px-4 text-sm leading-relaxed text-amber-100",
	},
	solution: {
		label: "Solution",
		icon: buildIcon("Solution insight", "h-4 w-4 text-emerald-400", [
			<path
				key="solution-check"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m5 13 4 4L19 7"
			/>,
		]),
		trigger:
			"px-4 text-left text-sm font-semibold uppercase tracking-wide text-emerald-200 data-[state=open]:bg-emerald-950/30",
		content: "px-4 text-sm leading-relaxed text-emerald-100",
	},
};

const ProductSummary = ({ description, abTest }: ProductSummaryProps) => {
	const painPoint = extractCopyField("pain_point", abTest);
	const solution = extractCopyField("solution", abTest);
	const fear = extractCopyField("fear", abTest);
	const hope = extractCopyField("hope", abTest);

	const insightEntries = useMemo(
		() =>
			[
				{ key: "fear" as InsightKey, value: fear },
				{ key: "hope" as InsightKey, value: hope },
				{ key: "pain_point" as InsightKey, value: painPoint },
				{ key: "solution" as InsightKey, value: solution },
			].filter((entry) => entry.value && entry.value.length > 0) as Array<{
				key: InsightKey;
				value: string;
			}>,
		[fear, hope, painPoint, solution],
	);

	const highlightWords = useMemo(() => {
		const set = new Set<string>();
		if (abTest?.variants) {
			for (const variant of abTest.variants) {
				const words = variant.copy?.highlighted_words;
				if (!words) continue;
				for (const word of words) {
					const trimmed = word?.trim();
					if (trimmed) {
						set.add(trimmed);
					}
				}
			}
		}
		return Array.from(set);
	}, [abTest]);

	const highlightDescriptors = useMemo(() => {
		if (!abTest) return [];

		const descriptors: Array<{
			key: string;
			phrase: string;
			className: string;
		}> = [];
		const seen = new Set<string>();

		const pushDescriptor = (
			key: string,
			phrase?: string,
			className?: string,
		) => {
			if (!phrase || !className) return;
			const normalized = `${key}-${phrase.toLowerCase()}`;
			if (seen.has(normalized)) return;
			seen.add(normalized);
			descriptors.push({ key, phrase, className });
		};

		pushDescriptor(
			"pain_point",
			extractCopyField("pain_point", abTest),
			"bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-200",
		);
		pushDescriptor(
			"fear",
			extractCopyField("fear", abTest),
			"bg-red-100 text-red-900 dark:bg-red-600/40 dark:text-red-50",
		);
		pushDescriptor(
			"hope",
			extractCopyField("hope", abTest),
			"bg-sky-100 text-sky-800 dark:bg-sky-500/10 dark:text-sky-200",
		);
		pushDescriptor(
			"solution",
			extractCopyField("solution", abTest),
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200",
		);

		if (abTest.variants) {
			for (const variant of abTest.variants) {
				const words = variant.copy?.highlighted_words;
				if (Array.isArray(words)) {
					for (const word of words) {
						const trimmed = word?.trim();
						if (trimmed) {
							pushDescriptor(
								`keyword-${trimmed}`,
								trimmed,
								"bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200",
							);
						}
					}
				}

				const cta = variant.copy?.cta;
				pushDescriptor(
					"cta",
					cta,
					"bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-200",
				);
			}
		}

		return descriptors;
	}, [abTest]);

	const highlightedDescription = useMemo(() => {
		if (!description) return null;
		if (!highlightDescriptors.length) return description;

		const occupied: Array<{ start: number; end: number }> = [];
		const matches: Array<{
			start: number;
			end: number;
			className: string;
			key: string;
			match: string;
		}> = [];

		for (const descriptor of highlightDescriptors) {
			const pattern = new RegExp(escapeRegExp(descriptor.phrase), "gi");
			for (const match of description.matchAll(pattern)) {
				const start = match.index ?? 0;
				const end = start + match[0].length;
				const overlaps = occupied.some(
					(range) => Math.max(range.start, start) < Math.min(range.end, end),
				);

				if (overlaps) {
					continue;
				}

				occupied.push({ start, end });
				matches.push({
					start,
					end,
					className: descriptor.className,
					key: descriptor.key,
					match: match[0],
				});
			}
		}

		if (!matches.length) return description;

		matches.sort((a, b) => a.start - b.start);

		const nodes: React.ReactNode[] = [];
		let cursor = 0;

		matches.forEach((item, index) => {
			if (cursor < item.start) {
				nodes.push(
					<Fragment key={`text-${index}-${cursor}`}>
						{description.slice(cursor, item.start)}
					</Fragment>,
				);
			}

			nodes.push(
				<mark
					key={`highlight-${item.key}-${index}`}
					className={cn("rounded-sm px-1 py-0.5 font-semibold", item.className)}
				>
					{item.match}
				</mark>,
			);
			cursor = item.end;
		});

		if (cursor < description.length) {
			nodes.push(
				<Fragment key={`text-tail-${cursor}`}>
					{description.slice(cursor)}
				</Fragment>,
			);
		}

		return nodes;
	}, [description, highlightDescriptors]);

	if (!description && insightEntries.length === 0) {
		return null;
	}

	return (
		<div className="mt-4 flex flex-col gap-4 text-left">
			{description && (
				<p className="line-clamp-3 text-slate-600 text-sm dark:text-slate-300">
					{highlightedDescription}
				</p>
			)}

			{highlightWords.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{highlightWords.map((word) => (
						<span
							key={word}
							className="rounded-full bg-blue-500/10 px-2 py-1 font-medium text-blue-600 text-xs dark:bg-blue-500/20 dark:text-blue-200"
						>
							{word}
						</span>
					))}
				</div>
			)}

			{insightEntries.length > 0 && (
				<Accordion
					type="single"
					collapsible
					defaultValue={insightEntries[0]?.key}
					className="overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/80"
				>
					{insightEntries.map(({ key, value }) => {
						const accent = insightAccents[key];
						return (
							<AccordionItem
								key={key}
								value={key}
								className="border-slate-200/30 border-b dark:border-slate-800/40"
							>
								<AccordionTrigger
									className={cn(
										accent.trigger,
										"bg-slate-50/30 dark:bg-slate-900/40",
									)}
								>
									<span className="flex items-center gap-2">
										{accent.icon}
										{accent.label}
									</span>
								</AccordionTrigger>
								<AccordionContent
									className={cn(
										accent.content,
										"bg-slate-50/20 dark:bg-slate-900/20",
									)}
								>
									{value}
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			)}
		</div>
	);
};

export default ProductSummary;
