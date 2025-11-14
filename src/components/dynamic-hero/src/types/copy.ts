import { z } from "zod";

export const heroChipVariantSchema = z.enum([
	"default",
	"secondary",
	"outline",
]);

export const heroChipSchema = z
	.object({
		label: z.string(),
		sublabel: z.string().optional(),
		variant: heroChipVariantSchema.optional(),
	})
	.refine(
		(chip) => chip.label.trim().split(/\s+/).length <= 6,
		"Chip label must not exceed six words.",
	);

export const heroCopyRotationsSchema = z.object({
	problems: z.array(z.string()).optional(),
	solutions: z.array(z.string()).optional(),
	fears: z.array(z.string()).optional(),
});

export const heroCopyValuesSchema = z.object({
	problem: z.string(),
	solution: z.string(),
	fear: z.string(),
	socialProof: z.string(),
	benefit: z.string(),
	time: z.string(),
	hope: z.string().optional(),
});

export const heroCopySchema = z.object({
	titleTemplate: z.string().optional(),
	subtitleTemplate: z.string().optional(),
	values: heroCopyValuesSchema,
	rotations: heroCopyRotationsSchema.optional(),
	primaryChip: heroChipSchema.optional(),
	secondaryChip: heroChipSchema.optional(),
});

export type HeroChipVariant = z.infer<typeof heroChipVariantSchema>;
export type HeroChip = z.infer<typeof heroChipSchema>;
export type HeroCopyRotations = z.infer<typeof heroCopyRotationsSchema>;
export type HeroCopyValues = z.infer<typeof heroCopyValuesSchema>;
export type HeroCopy = z.infer<typeof heroCopySchema>;
