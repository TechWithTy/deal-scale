"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { useEffect } from "react";

import type { AnalyticsConfig } from "@/lib/analytics/config";

interface AnalyticsProps {
	config: Pick<AnalyticsConfig, "gaId" | "gtmId">;
}

/**
 * Optimized Analytics component that loads GTM and GA with performance optimizations.
 *
 * GTM Optimization Strategies:
 * 1. Next.js GoogleTagManager already loads asynchronously and is deferred via DeferredThirdParties
 * 2. Initialize dataLayer early to queue events before GTM fully loads
 * 3. Additional GTM Container Optimizations (configure in GTM dashboard):
 *    - Use "Consent Mode" for privacy-compliant loading
 *    - Configure trigger conditions to limit unnecessary tag firing
 *    - Use "Tag Sequencing" to prioritize critical tags
 *    - Review and remove unused tags/triggers
 *    - Use "Tag Timeout" settings to prevent slow tags from blocking
 */
export function Analytics({ config }: AnalyticsProps) {
	const { gaId, gtmId } = config;

	// Initialize dataLayer early to queue events before GTM loads
	// This ensures events are captured even if GTM loads later
	useEffect(() => {
		if (!gtmId || typeof window === "undefined") {
			return;
		}

		// Initialize dataLayer if it doesn't exist
		window.dataLayer = window.dataLayer || [];

		// Push initial configuration to dataLayer
		// This queues events before GTM is fully loaded
		if (window.dataLayer.length === 0) {
			window.dataLayer.push({
				event: "gtm.js",
				"gtm.start": new Date().getTime(),
			});
		}
	}, [gtmId]);

	if (!gaId && !gtmId) {
		return null;
	}

	// Next.js GoogleTagManager component already handles:
	// - Async loading
	// - Proper script placement
	// - Performance optimizations
	// Additional optimization should be done in GTM container settings
	return (
		<>
			{gaId && <GoogleAnalytics gaId={gaId} />}
			{gtmId && <GoogleTagManager gtmId={gtmId} />}
		</>
	);
}
