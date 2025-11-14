import type { priorityPilotFormSchema } from "@/data/contact/pilotFormFields";
import type { z } from "zod";

/**
 * @description Represents the type derived from the Zod schema for a pilot program user.
 * This type includes all the fields necessary for the priority pilot program application.
 * @see priorityPilotFormSchema
 */
export type PilotUser = z.infer<typeof priorityPilotFormSchema>;
