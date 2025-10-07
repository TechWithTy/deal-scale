"use client";

import { dispatchMetric } from "@/app/reportWebVitals";
import { useEffect, useRef } from "react";

const RESOURCE_TRANSFER_THRESHOLD = 50_000;
const RESOURCE_DURATION_THRESHOLD = 300;
const MAX_RESOURCE_REPORTS = 24;
const MAX_LONG_TASK_REPORTS = 16;
const LONG_TASK_THRESHOLD = 50;

function safeToFixed(value: number) {
	return Number(value.toFixed(3));
}

function shouldReportResource(
	entry: PerformanceResourceTiming,
	isThirdParty: boolean,
) {
	const { transferSize = 0, duration = 0 } = entry;
	const renderBlockingStatus = (entry as PerformanceResourceTiming & {
		renderBlockingStatus?: string;
	}).renderBlockingStatus;
	if (
		renderBlockingStatus === "blocking" ||
		renderBlockingStatus === "queued"
	) {
		return true;
	}

	if (isThirdParty) {
		return transferSize > 0 || duration >= RESOURCE_DURATION_THRESHOLD;
	}

	return (
		transferSize >= RESOURCE_TRANSFER_THRESHOLD ||
		duration >= RESOURCE_DURATION_THRESHOLD
	);
}

export function PerformanceMonitor() {
	const reportedResourcesRef = useRef(new Set<string>());
	const reportedLongTasksRef = useRef(new Set<string>());
	const resourceReportCountRef = useRef(0);
	const longTaskReportCountRef = useRef(0);

	useEffect(() => {
		if (
			typeof window === "undefined" ||
			typeof PerformanceObserver === "undefined"
		) {
			return;
		}

		const supportedTypes = PerformanceObserver.supportedEntryTypes || [];
		const cleanupCallbacks: Array<() => void> = [];

		if (supportedTypes.includes("resource")) {
			try {
				const resourceObserver = new PerformanceObserver((list) => {
					const origin = window.location.origin;
					for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
						if (resourceReportCountRef.current >= MAX_RESOURCE_REPORTS) {
							break;
						}

						const key = `${entry.name}-${Math.round(entry.startTime)}`;
						if (reportedResourcesRef.current.has(key)) {
							continue;
						}

						const isThirdParty = Boolean(
							origin && !entry.name.startsWith(origin),
						);

						if (!shouldReportResource(entry, isThirdParty)) {
							continue;
						}

						reportedResourcesRef.current.add(key);
						resourceReportCountRef.current += 1;

						dispatchMetric({
							type: "resource-timing",
							id: key,
							name: entry.name,
							initiatorType: entry.initiatorType,
							transferSize:
								entry.transferSize && entry.transferSize > 0
									? Math.round(entry.transferSize)
									: undefined,
							encodedBodySize:
								entry.encodedBodySize && entry.encodedBodySize > 0
									? Math.round(entry.encodedBodySize)
									: undefined,
							decodedBodySize:
								entry.decodedBodySize && entry.decodedBodySize > 0
									? Math.round(entry.decodedBodySize)
									: undefined,
							duration: safeToFixed(entry.duration),
							startTime: safeToFixed(entry.startTime),
							isThirdParty: isThirdParty || undefined,
							renderBlockingStatus:
								"renderBlockingStatus" in entry
									? entry.renderBlockingStatus
									: undefined,
							page: window.location.pathname,
							timestamp: Date.now(),
						});
					}
				});

				resourceObserver.observe({ entryTypes: ["resource"] });
				cleanupCallbacks.push(() => resourceObserver.disconnect());
			} catch {
				// ! Ignore observer failures – not all browsers implement every entry type.
			}
		}

		if (supportedTypes.includes("longtask")) {
			try {
				const longTaskObserver = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (longTaskReportCountRef.current >= MAX_LONG_TASK_REPORTS) {
							break;
						}

						if (entry.duration < LONG_TASK_THRESHOLD) {
							continue;
						}

						const key = `${Math.round(entry.startTime)}-${Math.round(entry.duration)}`;
						if (reportedLongTasksRef.current.has(key)) {
							continue;
						}

						reportedLongTasksRef.current.add(key);
						longTaskReportCountRef.current += 1;

						const attribution = (
							entry as PerformanceEntry & {
								attribution?: Array<{ name?: string }>;
							}
						).attribution?.[0]?.name;

						dispatchMetric({
							type: "long-task",
							id: key,
							name: entry.name || "longtask",
							duration: safeToFixed(entry.duration),
							startTime: safeToFixed(entry.startTime),
							attribution,
							page: window.location.pathname,
							timestamp: Date.now(),
						});
					}
				});

				longTaskObserver.observe({ entryTypes: ["longtask"] });
				cleanupCallbacks.push(() => longTaskObserver.disconnect());
			} catch {
				// ! Ignore observer failures – longtask is not available in all environments.
			}
		}

		return () => {
			for (const cleanup of cleanupCallbacks) {
				cleanup();
			}
		};
	}, []);

	return null;
}
