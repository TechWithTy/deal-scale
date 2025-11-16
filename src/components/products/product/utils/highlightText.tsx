import { cn } from "@/lib/utils";
import { Fragment } from "react";

type HighlightKind = "cta" | "solution" | "hope" | "fear" | "pain" | "keyword";

type HighlightGroups = Partial<Record<HighlightKind, string[]>>;

const HIGHLIGHT_STYLES: Record<HighlightKind, string> = {
	cta: "bg-emerald-100 text-emerald-900 dark:bg-emerald-600/60 dark:text-emerald-50",
	solution: "bg-blue-100 text-blue-900 dark:bg-blue-600/40 dark:text-blue-50",
	hope: "bg-sky-100 text-sky-900 dark:bg-sky-500/40 dark:text-sky-50",
	fear: "bg-red-50 text-red-700 sm:bg-red-100 sm:text-red-900 dark:bg-red-600/30 dark:text-red-200 sm:dark:bg-red-600/50 sm:dark:text-red-50",
	pain: "bg-rose-100 text-rose-900 dark:bg-rose-600/40 dark:text-rose-50",
	keyword:
		"bg-purple-100 text-purple-900 dark:bg-purple-500/40 dark:text-purple-50",
};

const ORDER: HighlightKind[] = [
	"cta",
	"solution",
	"fear",
	"hope",
	"pain",
	"keyword",
];

const escapeForRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface HighlightDescriptor {
	key: HighlightKind;
	phrase: string;
	className: string;
}

const buildDescriptors = (groups: HighlightGroups) => {
	const descriptors: HighlightDescriptor[] = [];
	const seen = new Set<string>();

	ORDER.forEach((key) => {
		const phrases = groups[key];
		if (!phrases) return;

		phrases.forEach((phrase) => {
			const trimmed = phrase?.trim();
			if (!trimmed) return;

			const identifier = `${key}:${trimmed.toLowerCase()}`;
			if (seen.has(identifier)) return;
			seen.add(identifier);

			descriptors.push({
				key,
				phrase: trimmed,
				className: HIGHLIGHT_STYLES[key],
			});
		});
	});

	return descriptors;
};

export function highlightText(text: string, groups: HighlightGroups = {}) {
	const descriptors = buildDescriptors(groups);
	if (!descriptors.length) return text;

	const occupied: Array<{ start: number; end: number }> = [];
	const matches: Array<{
		start: number;
		end: number;
		className: string;
		key: HighlightKind;
		match: string;
	}> = [];

	descriptors.forEach((descriptor) => {
		const regex = new RegExp(escapeForRegex(descriptor.phrase), "gi");
		let match: RegExpExecArray | null;

		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(text)) !== null) {
			const start = match.index;
			const end = start + match[0].length;
			const overlaps = occupied.some(
				(range) => Math.max(range.start, start) < Math.min(range.end, end),
			);

			if (overlaps) continue;

			occupied.push({ start, end });
			matches.push({
				start,
				end,
				className: descriptor.className,
				key: descriptor.key,
				match: match[0],
			});
		}
	});

	if (!matches.length) return text;

	matches.sort((a, b) => a.start - b.start);

	const nodes: React.ReactNode[] = [];
	let cursor = 0;

	matches.forEach((item, index) => {
		if (cursor < item.start) {
			nodes.push(
				<Fragment key={`text-${index}-${cursor}`}>
					{text.slice(cursor, item.start)}
				</Fragment>,
			);
		}

		nodes.push(
			<mark
				key={`highlight-${item.key}-${index}`}
				className={cn("rounded px-1 py-0.5 font-semibold", item.className)}
			>
				{item.match}
			</mark>,
		);
		cursor = item.end;
	});

	if (cursor < text.length) {
		nodes.push(
			<Fragment key={`text-tail-${cursor}`}>{text.slice(cursor)}</Fragment>,
		);
	}

	return nodes;
}
