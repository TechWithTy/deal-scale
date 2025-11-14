const truthyValues = new Set(["1", "true", "on", "yes"]);

const DEFAULT_SNOOZE_MS = 2000;

const parseEnabledEnv = () =>
	(process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT ?? "false")
		.trim()
		.toLowerCase();

const parseSnoozeEnv = () => process.env.NEXT_PUBLIC_EXIT_INTENT_SNOOZE_MS ?? "";
const parseDebugEnv = () =>
	(process.env.NEXT_PUBLIC_EXIT_INTENT_DEBUG ?? "false").trim().toLowerCase();

export const exitIntentEnabled = () =>
	truthyValues.has(parseEnabledEnv());

export const exitIntentSnoozeMs = () => {
	const parsed = Number.parseInt(parseSnoozeEnv(), 10);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_SNOOZE_MS;
};

export const exitIntentDebugEnabled = () =>
	truthyValues.has(parseDebugEnv());

