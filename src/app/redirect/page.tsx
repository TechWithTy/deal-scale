"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Client-side redirect page that fires Facebook Pixel "Lead" event
 * before redirecting to the destination URL.
 *
 * This page is used when Facebook Pixel tracking is enabled for a redirect.
 * It fires the pixel event, waits 600ms to ensure the event is sent,
 * then redirects to the destination while preserving all query parameters.
 */
export default function RedirectPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Get destination URL from query params
		const destination = searchParams.get("to");
		if (!destination) {
			console.error("[RedirectPage] Missing 'to' parameter");
			return;
		}

		// Get Facebook Pixel event parameters
		const fbSource = searchParams.get("fbSource");
		const fbIntent = searchParams.get("fbIntent");

		// Fire Facebook Pixel Lead event if pixel is available
		if (typeof window !== "undefined" && window.fbq) {
			try {
				window.fbq("track", "Lead", {
					source: fbSource || "Meta campaign",
					intent: fbIntent || "MVP_Launch_BlackFriday",
				});
			} catch (error) {
				console.error(
					"[RedirectPage] Failed to track Facebook Pixel event:",
					error,
				);
			}
		}

		// Build destination URL with all query parameters preserved
		let redirectUrl: string;
		try {
			// If destination is already a full URL, use it directly
			if (/^https?:/i.test(destination)) {
				const url = new URL(destination);
				// Preserve all query params from current page (except 'to', 'fbSource', 'fbIntent')
				for (const [key, value] of searchParams.entries()) {
					if (key !== "to" && key !== "fbSource" && key !== "fbIntent") {
						if (!url.searchParams.has(key)) {
							url.searchParams.set(key, value);
						}
					}
				}
				redirectUrl = url.toString();
			} else {
				// Relative path - build URL relative to current origin
				const baseUrl =
					typeof window !== "undefined" ? window.location.origin : "";
				const url = new URL(destination, baseUrl || "http://localhost");
				// Preserve all query params from current page (except 'to', 'fbSource', 'fbIntent')
				for (const [key, value] of searchParams.entries()) {
					if (key !== "to" && key !== "fbSource" && key !== "fbIntent") {
						if (!url.searchParams.has(key)) {
							url.searchParams.set(key, value);
						}
					}
				}
				// For relative paths, use pathname + search for router.push
				redirectUrl = url.pathname + url.search;
			}
		} catch (error) {
			console.error("[RedirectPage] Error building redirect URL:", error);
			redirectUrl = destination;
		}

		// Wait 600ms to allow pixel to send before redirect
		// 500-800ms is optimal for pixel tracking
		const timer = setTimeout(() => {
			try {
				// Use window.location.href for external URLs, router.push for internal
				if (/^https?:/i.test(redirectUrl)) {
					window.location.href = redirectUrl;
				} else {
					router.push(redirectUrl);
				}
			} catch (error) {
				console.error("[RedirectPage] Error during redirect:", error);
				// Fallback to window.location
				window.location.href = redirectUrl;
			}
		}, 600);

		return () => clearTimeout(timer);
	}, [router, searchParams]);

	// Return blank page or minimal loading indicator
	return <></>;
}
