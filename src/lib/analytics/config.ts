import { z } from "zod";

export type AnalyticsField =
        | "clarityId"
        | "gaId"
        | "gtmId"
        | "zohoCode"
        | "plausibleDomain"
        | "plausibleEndpoint";

export interface AnalyticsConfig {
        clarityId?: string;
        gaId?: string;
        gtmId?: string;
        zohoCode?: string;
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

interface EnvDescriptor {
        field: AnalyticsField;
        primary: string | undefined;
        fallback: string | undefined;
}

const fieldDescriptors: EnvDescriptor[] = [
        {
                field: "clarityId",
                primary: process.env.CLARITY_PROJECT_ID,
                fallback: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
        },
        {
                field: "gaId",
                primary: process.env.GOOGLE_ANALYTICS_ID,
                fallback: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
        },
        {
                field: "gtmId",
                primary: process.env.GOOGLE_TAG_MANAGER_ID,
                fallback: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
        },
        {
                field: "zohoCode",
                primary: process.env.ZOHO_SALES_IQ_WIDGET_CODE,
                fallback: process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE,
        },
        {
                field: "plausibleDomain",
                primary: process.env.PLAUSIBLE_DOMAIN,
                fallback: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
        },
        {
                field: "plausibleEndpoint",
                primary: process.env.PLAUSIBLE_ENDPOINT,
                fallback: process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT,
        },
];

const isDevelopmentLike = () => process.env.NODE_ENV !== "production";

/**
 * Reads analytics configuration from environment variables with validation.
 */
export function getAnalyticsConfig(): AnalyticsConfigResult {
        const config: AnalyticsConfig = {};
        const warnings: AnalyticsIssue[] = [];
        const errors: AnalyticsIssue[] = [];
        const fallbacksUsed: Partial<Record<AnalyticsField, boolean>> = {};

        const allowFallback = isDevelopmentLike();

        for (const descriptor of fieldDescriptors) {
                const trimmedPrimary = descriptor.primary?.trim();
                if (trimmedPrimary) {
                        config[descriptor.field] = trimmedPrimary;
                        continue;
                }

                const trimmedFallback = descriptor.fallback?.trim();
                if (trimmedFallback && allowFallback) {
                        config[descriptor.field] = trimmedFallback;
                        fallbacksUsed[descriptor.field] = true;
                        warnings.push({
                                field: descriptor.field,
                                message: `Using NEXT_PUBLIC fallback for ${descriptor.field} in development.`,
                        });
                        continue;
                }

                if (trimmedFallback && !allowFallback) {
                        warnings.push({
                                field: descriptor.field,
                                message: `Ignoring NEXT_PUBLIC fallback for ${descriptor.field} outside development.`,
                        });
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
