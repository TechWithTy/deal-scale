"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import type { AnalyticsConfig } from "@/lib/analytics/config";

interface AnalyticsProps {
        config: Pick<AnalyticsConfig, "gaId" | "gtmId">;
}

export function Analytics({ config }: AnalyticsProps) {
        const { gaId, gtmId } = config;

        if (!gaId && !gtmId) {
                return null;
        }

        return (
                <>
                        {gaId && <GoogleAnalytics gaId={gaId} />}
                        {gtmId && <GoogleTagManager gtmId={gtmId} />}
                </>
        );
}
