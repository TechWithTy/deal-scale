"use client";

import { useEffect, useMemo, useState } from "react";

import type { ActivityEvent } from "@/data/activity/activityStream";

const DEFAULT_INTERVAL_MS = 3200;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type UseActivityRollerOptions = {
	events: ActivityEvent[];
	intervalMs?: number;
	/** If false, rotation is paused (e.g., when offscreen). */
	active?: boolean;
};

type ActivityRollerState = {
	activeEvent: ActivityEvent | null;
	activeIndex: number;
	events: ActivityEvent[];
	prefersReducedMotion: boolean;
	setActiveIndex: (nextIndex: number) => void;
};

const getPrefersReducedMotion = (): boolean => {
	if (typeof window === "undefined" || !window.matchMedia) {
		return false;
	}

	try {
		return window.matchMedia(REDUCED_MOTION_QUERY).matches;
	} catch {
		return false;
	}
};

const usePrefersReducedMotion = (): boolean => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(
		getPrefersReducedMotion(),
	);

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) {
			return;
		}

		const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
		const handleChange = (event: MediaQueryListEvent) => {
			setPrefersReducedMotion(event.matches);
		};

		// addEventListener is the modern API, but we fall back to addListener
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
			mediaQuery.addListener?.(handleChange);
		}

		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener("change", handleChange);
			} else {
				mediaQuery.removeListener?.(handleChange);
			}
		};
	}, []);

	return prefersReducedMotion;
};

export const useActivityRoller = ({
	events,
	intervalMs = DEFAULT_INTERVAL_MS,
	active = true,
}: UseActivityRollerOptions): ActivityRollerState => {
	const normalizedEvents = useMemo(() => events.filter(Boolean), [events]);
	const [activeIndex, setActiveIndex] = useState(0);
	const prefersReducedMotion = usePrefersReducedMotion();

	useEffect(() => {
		if (normalizedEvents.length <= 1) {
			return;
		}

		const safeIndex = activeIndex % normalizedEvents.length;
		if (safeIndex !== activeIndex) {
			setActiveIndex(safeIndex);
		}
	}, [activeIndex, normalizedEvents.length]);

	useEffect(() => {
		if (!active || prefersReducedMotion || normalizedEvents.length <= 1) {
			return;
		}

		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % normalizedEvents.length);
		}, intervalMs);

		return () => window.clearInterval(timer);
	}, [intervalMs, prefersReducedMotion, normalizedEvents.length, active]);

	const activeEvent =
		normalizedEvents.length === 0
			? null
			: normalizedEvents[activeIndex % normalizedEvents.length];

	return {
		activeEvent,
		activeIndex,
		events: normalizedEvents,
		prefersReducedMotion,
		setActiveIndex,
	};
};

type ActivityRollerProps = UseActivityRollerOptions & {
	children: (state: ActivityRollerState) => JSX.Element;
};

export const ActivityRoller = ({
	children,
	events,
	intervalMs,
	active = true,
}: ActivityRollerProps): JSX.Element => {
	const state = useActivityRoller({ events, intervalMs, active });
	return children(state);
};

export { usePrefersReducedMotion };
