/**
 * Agent configuration modeled after the agents dashboard schema.
 */
export type AgentType = "phone" | "direct mail" | "social";

export type AgentBillingCycle = "monthly" | "one-time";

export interface AgentConfig {
	/** Unique identifier assigned when the agent is persisted. */
	id?: string;
	/** Human readable name of the agent. */
	name: string;
	/** Channel-specific type used to drive the configuration UI. */
	type: AgentType;
	/** Marketing description shown across marketplace surfaces. */
	description?: string;
	/** Preview image used across cards and detail pages. */
	image?: string;
	/** Whether the agent is visible within the marketplace. */
	isPublic: boolean;
	/** Whether the agent can be launched without payment. */
	isFree: boolean;
	/** Pricing multiplier (1-5) that drives marketplace pricing tiers. */
	priceMultiplier: number;
	/** Default billing cadence applied when monetizing the agent. */
	billingCycle: AgentBillingCycle;
	/** Voice identifier for phone agents. */
	voice?: string;
	/** Background audio loop for phone agents. */
	backgroundNoise?: string;
	/** Script used when the agent routes to voicemail. */
	voicemailScript?: string;
	/** Avatar preset identifier for social agents. */
	avatar?: string;
	/** Custom avatar image override. */
	avatarImage?: string;
	/** Background video for social landing pages. */
	backgroundVideo?: string;
	/** Background image for social landing pages. */
	backgroundImage?: string;
	/** Primary brand color for theming. */
	color1?: string;
	/** Secondary brand color for theming. */
	color2?: string;
	/** Accent color for highlights and CTAs. */
	color3?: string;
	/** Supporting asset list (max 8 in the dashboard schema). */
	socialAssets?: string[];
	/** Primary outcome or KPI the agent targets. */
	campaignGoal?: string;
	/** Script or prompt used when generating conversations. */
	salesScript?: string;
	/** Persona prompt capturing tone and personality. */
	persona?: string;
	/** Template payloads for direct mail agents. */
	directMailTemplates?: unknown[];
}
