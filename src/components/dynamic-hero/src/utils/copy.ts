import {
	type HeroChip,
	type HeroCopy,
	type HeroCopyRotations,
	type HeroCopyValues,
	heroChipSchema,
	heroCopySchema,
} from "../types/copy";

export interface ResolveHeroCopyOptions {
	titleTemplate?: string;
	subtitleTemplate?: string;
	fallbackPrimaryChip?: HeroChip;
	fallbackSecondaryChip?: HeroChip;
}

export interface ResolvedHeroCopy {
	title: string;
	subtitle: string;
	values: HeroCopyValues;
	rotations: HeroCopyRotations;
	chips: {
		primary?: HeroChip;
		secondary?: HeroChip;
	};
}

const sanitizeText = (value: string) => value.replace(/\u2014/g, "-");
const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const HERO_PHRASE_LIMITS = {
	minWords: 3,
	maxWords: 6,
} as const;

const HERO_PHRASE_DEFAULTS = {
	problem: "manual hero work",
	solution: "automated hero launches",
	fear: "your launch pipeline stalls",
} satisfies Record<"problem" | "solution" | "fear", string>;

const isDev = process.env.NODE_ENV !== "production";

const toWords = (value: string) =>
	collapseWhitespace(value).split(" ").filter(Boolean);

type HeroPhraseCategory = keyof Pick<
	HeroCopyValues,
	"problem" | "solution" | "fear"
>;

const normalizePhrase = (
	value: string | undefined,
	category: HeroPhraseCategory,
): string | null => {
	if (!value) {
		if (isDev) {
			console.warn(
				`[dynamic-hero] Received empty ${category} phrase; skipping entry.`,
			);
		}
		return null;
	}

	const normalized = collapseWhitespace(value);
	if (!normalized.length) {
		if (isDev) {
			console.warn(
				`[dynamic-hero] ${category} phrase only contained whitespace; skipping entry.`,
			);
		}
		return null;
	}

	const words = toWords(normalized);
	if (words.length < HERO_PHRASE_LIMITS.minWords) {
		if (isDev) {
			console.warn(
				`[dynamic-hero] ${category} phrase "${normalized}" has fewer than ${HERO_PHRASE_LIMITS.minWords} words; dropping phrase.`,
			);
		}
		return null;
	}

	if (words.length > HERO_PHRASE_LIMITS.maxWords) {
		if (isDev) {
			console.warn(
				`[dynamic-hero] ${category} phrase "${normalized}" exceeded ${HERO_PHRASE_LIMITS.maxWords} words; truncating.`,
			);
		}
		return words.slice(0, HERO_PHRASE_LIMITS.maxWords).join(" ");
	}

	return normalized;
};

const ensurePhraseFallback = (
	value: string,
	category: HeroPhraseCategory,
): string => {
	return (
		normalizePhrase(value, category) ??
		normalizePhrase(HERO_PHRASE_DEFAULTS[category], category) ??
		HERO_PHRASE_DEFAULTS[category]
	);
};

const enforcePhraseConstraints = (
	rotations: readonly string[] | undefined,
	fallback: string,
	category: HeroPhraseCategory,
) => {
	const fallbackPhrase = ensurePhraseFallback(fallback, category);
	const normalized =
		rotations
			?.map((phrase) => normalizePhrase(phrase, category))
			.filter((value): value is string => Boolean(value)) ?? [];

	return normalized.length ? normalized : [fallbackPhrase];
};

const sanitizeChip = (chip: HeroChip | undefined): HeroChip | undefined => {
	if (!chip) {
		return undefined;
	}

	return heroChipSchema.parse({
		...chip,
		label: sanitizeText(chip.label),
		sublabel: chip.sublabel ? sanitizeText(chip.sublabel) : undefined,
	});
};

const sanitizeValues = (values: HeroCopyValues): HeroCopyValues => ({
	problem: sanitizeText(values.problem),
	solution: sanitizeText(values.solution),
	fear: sanitizeText(values.fear),
	socialProof: sanitizeText(values.socialProof),
	benefit: sanitizeText(values.benefit),
	time: values.time,
	hope: values.hope ? sanitizeText(values.hope) : undefined,
});

const ensureRotations = (
	rotations: HeroCopyRotations,
	values: HeroCopyValues,
) => ({
	problems: enforcePhraseConstraints(
		rotations.problems?.map(sanitizeText),
		values.problem,
		"problem",
	),
	solutions: enforcePhraseConstraints(
		rotations.solutions?.map(sanitizeText),
		values.solution,
		"solution",
	),
	fears: enforcePhraseConstraints(
		rotations.fears?.map(sanitizeText),
		values.fear,
		"fear",
	),
});

const applyTemplate = (
	template: string | undefined,
	values: HeroCopyValues,
	defaultTemplate: string,
) =>
	sanitizeText(
		(template ?? defaultTemplate).replace(
			/{{\s*(\w+)\s*}}/g,
			(match, token) => values[token as keyof HeroCopyValues] ?? match,
		),
	);

export const resolveHeroCopy = (
	copy: HeroCopy,
	{
		titleTemplate,
		subtitleTemplate,
		fallbackPrimaryChip,
		fallbackSecondaryChip,
	}: ResolveHeroCopyOptions = {},
): ResolvedHeroCopy => {
	const parsed = heroCopySchema.parse(copy);
	const values = sanitizeValues(parsed.values);
	const resolvedRotations = ensureRotations(parsed.rotations ?? {}, values);

	const resolvedPrimaryChip =
		sanitizeChip(parsed.primaryChip) ?? sanitizeChip(fallbackPrimaryChip);
	const resolvedSecondaryChip =
		sanitizeChip(parsed.secondaryChip) ?? sanitizeChip(fallbackSecondaryChip);

	return {
		title: applyTemplate(
			parsed.titleTemplate,
			values,
			titleTemplate ??
				"Stop {{problem}}, start {{solution}} - before {{fear}}.",
		),
		subtitle: applyTemplate(
			parsed.subtitleTemplate,
			values,
			subtitleTemplate ??
				"{{socialProof}} {{benefit}} in under {{time}} minutes.",
		),
		values,
		rotations: resolvedRotations,
		chips: {
			primary: resolvedPrimaryChip,
			secondary: resolvedSecondaryChip,
		},
	};
};
