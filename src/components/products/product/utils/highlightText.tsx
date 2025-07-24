import { cn } from "@/lib/utils";

export function highlightText(
	text: string,
	primary: string[] = [],
	secondary: string[] = [],
) {
	if (!primary.length && !secondary.length) return text;

	// Combine and dedupe highlights, sort by length descending for greedy matching
	const allHighlights = [...primary, ...secondary].filter(Boolean);
	if (!allHighlights.length) return text;

	const sorted = Array.from(new Set(allHighlights)).sort(
		(a, b) => b.length - a.length,
	);

	const pattern = sorted
		.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.join("|");
	const regex = new RegExp(pattern, "gi");
	const parts = text.split(regex);
	const matches: Array<{ index: number; match: string }> = [];

	// Find all matches
	// Find all matches
	let match = regex.exec(text);
	while (match !== null) {
		matches.push({ index: match.index, match: match[0] });
		match = regex.exec(text);
	}

	const result: (string | JSX.Element)[] = [];

	for (let i = 0; i < parts.length; i += 1) {
		result.push(parts[i]);

		if (i < matches.length) {
			const phrase = matches[i].match;
			const isPrimaryMatch = primary.some(
				(w) => w.toLowerCase() === phrase.toLowerCase(),
			);
			const isSecondaryMatch = secondary.some(
				(w) => w.toLowerCase() === phrase.toLowerCase(),
			);

			if (isPrimaryMatch) {
				// First primary (CTA) is green, others use template color
				const isFirstPrimary =
					primary[0]?.toLowerCase() === phrase.toLowerCase();
				result.push(
					<mark
						key={`${i}-${phrase}`}
						className={cn(
							"rounded px-1 font-medium",
							isFirstPrimary
								? "bg-emerald-100 text-emerald-900 dark:bg-emerald-600/60 dark:text-emerald-50"
								: "bg-primary/10 text-foreground dark:bg-primary/40 dark:text-primary-foreground",
						)}
					>
						{phrase}
					</mark>,
				);
			} else if (isSecondaryMatch) {
				// Orange-red for secondary matches
				result.push(
					<mark
						key={`${i}-${phrase}`}
						className="rounded bg-orange-100 px-1 font-medium text-orange-900 dark:bg-red-700/60 dark:text-orange-50"
					>
						{phrase}
					</mark>,
				);
			}
		}
	}

	return result;
}
