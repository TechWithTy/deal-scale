"use client";

import { useEffect, useMemo, useState } from "react";

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = SECOND_IN_MS * 60;
const HOUR_IN_MS = MINUTE_IN_MS * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

export type CountdownParts = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	totalMs: number;
	isExpired: boolean;
};

export type UseCountdownOptions = {
	/**
	 * Target timestamp in milliseconds. If omitted, the countdown starts from the current time.
	 */
	targetTimestamp?: number;
	/**
	 * Milliseconds added to the current time when no explicit target is provided.
	 * Defaults to seven days.
	 */
	durationMs?: number;
	/**
	 * Frequency (in ms) for countdown updates. Defaults to one second.
	 */
	intervalMs?: number;
};

const getCountdownParts = (remainingMs: number): CountdownParts => {
	const clamped = Math.max(remainingMs, 0);
	const days = Math.floor(clamped / DAY_IN_MS);
	const hours = Math.floor((clamped % DAY_IN_MS) / HOUR_IN_MS);
	const minutes = Math.floor((clamped % HOUR_IN_MS) / MINUTE_IN_MS);
	const seconds = Math.floor((clamped % MINUTE_IN_MS) / SECOND_IN_MS);

	return {
		days,
		hours,
		minutes,
		seconds,
		totalMs: clamped,
		isExpired: clamped === 0,
	};
};

/**
 * Provides a real-time countdown to a future timestamp.
 */
export const FOUNDERS_CIRCLE_DEADLINE_STATE_KEY =
	"dealscale:founders-circle-deadline";

export const useCountdown = (
	options: UseCountdownOptions = {},
): CountdownParts & { formatted: string; targetIso: string } => {
	const {
		targetTimestamp,
		durationMs = DAY_IN_MS * 7,
		intervalMs = SECOND_IN_MS,
	} = options;

	const [targetTime] = useState<number>(() => {
		if (typeof targetTimestamp === "number") {
			return targetTimestamp;
		}
		return Date.now() + durationMs;
	});

	const [parts, setParts] = useState<CountdownParts>(() =>
		getCountdownParts(targetTime - Date.now()),
	);

	useEffect(() => {
		const updateParts = () => {
			setParts((prev) => {
				const next = getCountdownParts(targetTime - Date.now());
				if (next.totalMs === prev.totalMs) {
					return prev;
				}
				return next;
			});
		};

		updateParts();
		const timer = window.setInterval(updateParts, intervalMs);

		return () => {
			window.clearInterval(timer);
		};
	}, [intervalMs, targetTime]);

	const formatted = useMemo(() => {
		const segments: string[] = [
			`${parts.days}d`,
			`${parts.hours}h`,
			`${parts.minutes}m`,
			`${parts.seconds}s`,
		];
		return segments.join(" ");
	}, [parts.days, parts.hours, parts.minutes, parts.seconds]);

	const targetIso = useMemo(
		() => new Date(targetTime).toISOString(),
		[targetTime],
	);

	return {
		...parts,
		formatted,
		targetIso,
	};
};
