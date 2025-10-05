import type { NextWebVitalsMetric } from "next/app";

const DEFAULT_ENDPOINT = "/api/internal/vitals";

let navigationType: PerformanceNavigationTiming["type"] | undefined;

if (typeof window !== "undefined" && "performance" in window) {
	const navigationEntries = performance.getEntriesByType("navigation");
	const [navigationEntry] = navigationEntries as PerformanceNavigationTiming[];
	navigationType = navigationEntry?.type;
}

const vitalsEndpoint =
	process.env.NEXT_PUBLIC_VITALS_ENDPOINT &&
	process.env.NEXT_PUBLIC_VITALS_ENDPOINT.length > 0
		? process.env.NEXT_PUBLIC_VITALS_ENDPOINT
		: DEFAULT_ENDPOINT;

function sendMetric(body: string) {
	if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
		const beaconSent = navigator.sendBeacon(vitalsEndpoint, body);
		if (beaconSent) {
			return;
		}
	}

	void fetch(vitalsEndpoint, {
		method: "POST",
		body,
		headers: { "Content-Type": "application/json" },
		keepalive: true,
	}).catch(() => {
		// ! Swallow network errors – metrics should never break the page.
	});
}

export function dispatchMetric(payload: Record<string, unknown>) {
	sendMetric(JSON.stringify(payload));
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
	if (typeof window === "undefined") {
		return;
	}

	const payload = {
		type: "web-vital" as const,
		id: metric.id,
		name: metric.name,
		label: metric.label,
		value: Number(metric.value.toFixed(3)),
		page: window.location.pathname,
		navigationType,
		rating: "rating" in metric ? metric.rating : undefined,
		delta: "delta" in metric ? Number(metric.delta.toFixed(3)) : undefined,
		timestamp: Date.now(),
	};

	dispatchMetric(payload);

	if (process.env.NODE_ENV !== "production") {
		// * Surface metrics in development for quick feedback.
		// biome-ignore lint/suspicious/noConsole: intentional instrumentation log
		console.debug("[web-vitals]", metric.name, payload);
	}
}
