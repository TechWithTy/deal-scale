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
	problems: (rotations.problems ?? [values.problem]).map(sanitizeText),
	solutions: (rotations.solutions ?? [values.solution]).map(sanitizeText),
	fears: (rotations.fears ?? [values.fear]).map(sanitizeText),
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
