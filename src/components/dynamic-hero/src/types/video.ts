import { z } from "zod";

export const heroVideoProviderSchema = z.enum(["youtube", "supademo", "other"]);

export const heroVideoConfigSchema = z.object({
	src: z.string().url(),
	poster: z.string().optional(),
	provider: heroVideoProviderSchema.default("youtube"),
});

export type HeroVideoProvider = z.infer<typeof heroVideoProviderSchema>;
export type HeroVideoConfig = z.infer<typeof heroVideoConfigSchema>;
