import type { betaTesterFormSchema } from "@/data/contact/formFields";
import type { z } from "zod";

/**
 * @description Represents the type derived from the Zod schema for a beta tester.
 * This type includes all the fields necessary for beta tester registration and feedback.
 * @see betaTesterFormSchema
 */
export type BetaUser = z.infer<typeof betaTesterFormSchema>;
