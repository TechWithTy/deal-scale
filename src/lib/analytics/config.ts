import { z } from "zod";

export type AnalyticsField =
	| "clarityId"
	| "gaId"
	| "gtmId"
	| "zohoCode"
	| "facebookPixelId"
	| "plausibleDomain"
	| "plausibleEndpoint";

export interface AnalyticsConfig {
	clarityId?: string;
	gaId?: string;
	gtmId?: string;
	zohoCode?: string;
	facebookPixelId?: string;
	plausibleDomain?: string;
	plausibleEndpoint?: string;
}

export interface AnalyticsIssue {
	field: AnalyticsField;
	message: string;
}

export interface AnalyticsConfigResult {
	config: AnalyticsConfig;
	fallbacksUsed: Partial<Record<AnalyticsField, boolean>>;
	warnings: AnalyticsIssue[];
	errors: AnalyticsIssue[];
	hasErrors: boolean;
}

const analyticsSchema = z.object({
	clarityId: z
		.string()
		.trim()
		.min(1, "Clarity project ID must be a non-empty string")
		.optional(),
	gaId: z
		.string()
		.trim()
		.min(1, "Google Analytics ID must be a non-empty string")
		.optional(),
	gtmId: z
		.string()
		.trim()
		.min(1, "Google Tag Manager ID must be a non-empty string")
		.optional(),
	zohoCode: z
		.string()
		.trim()
		.min(1, "Zoho SalesIQ widget code must be a non-empty string")
		.optional(),
	facebookPixelId: z
		.string()
		.trim()
		.min(1, "Facebook Pixel ID must be a non-empty string")
		.optional(),
	plausibleDomain: z
		.string()
		.trim()
		.min(1, "Plausible domain must be a non-empty string")
		.optional(),
	plausibleEndpoint: z
		.string()
		.trim()
		.min(1, "Plausible endpoint must be a non-empty string")
		.optional(),
});

interface EnvSource {
	key: string;
}

interface EnvDescriptor {
	field: AnalyticsField;
	sources: EnvSource[];
}

const fieldDescriptors: EnvDescriptor[] = [
	{
		field: "clarityId",
		sources: [
			{ key: "NEXT_PUBLIC_CLARITY_PROJECT_ID" },
			{ key: "CLARITY_PROJECT_ID" },
		],
	},
	{
		field: "gaId",
		sources: [
			{ key: "NEXT_PUBLIC_GOOGLE_ANALYTICS" },
			{ key: "GOOGLE_ANALYTICS_ID" },
		],
	},
	{
		field: "gtmId",
		sources: [
			{ key: "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID" },
			{ key: "GOOGLE_TAG_MANAGER_ID" },
		],
	},
	{
		field: "zohoCode",
		sources: [
			{ key: "NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE" },
			{ key: "ZOHO_SALES_IQ_WIDGET_CODE" },
		],
	},
	{
		field: "facebookPixelId",
		sources: [
			{ key: "NEXT_PUBLIC_FACEBOOK_PIXEL_ID" },
			{ key: "FACEBOOK_PIXEL_ID" },
		],
	},
	{
		field: "plausibleDomain",
		sources: [
			{ key: "NEXT_PUBLIC_PLAUSIBLE_DOMAIN" },
			{ key: "PLAUSIBLE_DOMAIN" },
		],
	},
	{
		field: "plausibleEndpoint",
		sources: [
			{ key: "NEXT_PUBLIC_PLAUSIBLE_ENDPOINT" },
			{ key: "PLAUSIBLE_ENDPOINT" },
		],
	},
];

/**
 * Reads analytics configuration from environment variables with validation.
 */
export function getAnalyticsConfig(): AnalyticsConfigResult {
	const config: AnalyticsConfig = {};
	const warnings: AnalyticsIssue[] = [];
	const errors: AnalyticsIssue[] = [];
	const fallbacksUsed: Partial<Record<AnalyticsField, boolean>> = {};

	for (const descriptor of fieldDescriptors) {
		let resolvedValue: string | undefined;
		let resolvedSourceIndex = -1;

		for (const [index, source] of descriptor.sources.entries()) {
			const rawValue = process.env[source.key];
			const trimmedValue = rawValue?.trim();
			if (trimmedValue) {
				resolvedValue = trimmedValue;
				resolvedSourceIndex = index;
				break;
			}
		}

		if (resolvedValue) {
			config[descriptor.field] = resolvedValue;
			if (resolvedSourceIndex > 0) {
				fallbacksUsed[descriptor.field] = true;
				warnings.push({
					field: descriptor.field,
					message: `Using fallback environment variable ${
						descriptor.sources[resolvedSourceIndex].key
					} for ${descriptor.field}.`,
				});
			}
			continue;
		}

		warnings.push({
			field: descriptor.field,
			message: `Analytics provider ${descriptor.field} is not configured.`,
		});
	}

	const parsed = analyticsSchema.safeParse(config);
	if (!parsed.success) {
		for (const issue of parsed.error.issues) {
			const field = issue.path[0];
			if (typeof field === "string" && field in config) {
				errors.push({
					field: field as AnalyticsField,
					message: issue.message,
				});
			}
		}
	}

	return {
		config: parsed.success ? parsed.data : config,
		fallbacksUsed,
		warnings,
		errors,
		hasErrors: errors.length > 0,
	};
}
