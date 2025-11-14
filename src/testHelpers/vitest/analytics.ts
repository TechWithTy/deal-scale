import { vi } from "vitest";

type PlausibleModule = {
	init: ReturnType<typeof vi.fn>;
};

type PosthogModule = {
	init: ReturnType<typeof vi.fn>;
	capture: ReturnType<typeof vi.fn>;
	identify: ReturnType<typeof vi.fn>;
	reset: ReturnType<typeof vi.fn>;
	opt_out_capturing: ReturnType<typeof vi.fn>;
	opt_in_capturing: ReturnType<typeof vi.fn>;
	onFeatureFlags: ReturnType<typeof vi.fn>;
};

/**
 * Mocks the `server-only` module that Next.js expects to be present when importing
 * server-only utilities from the app directory.
 */
export const mockServerOnly = () => {
	vi.mock("server-only", () => ({}));
};

/**
 * Provides reusable mocks for third-party analytics providers so tests can
 * assert on invocation without triggering network calls.
 *
 * Returns references to the created spies for further assertions.
 */
export const mockAnalyticsProviders = () => {
	const plausible: PlausibleModule = {
		init: vi.fn(),
	};

	vi.mock("@plausible-analytics/tracker", () => ({
		__esModule: true,
		init: plausible.init,
	}));

	const posthog: PosthogModule = {
		init: vi.fn(),
		capture: vi.fn(),
		identify: vi.fn(),
		reset: vi.fn(),
		opt_out_capturing: vi.fn(),
		opt_in_capturing: vi.fn(),
		onFeatureFlags: vi.fn(),
	};

	vi.mock("posthog-js", () => ({
		__esModule: true,
		...posthog,
	}));

	return {
		plausibleInit: plausible.init,
		posthog,
	};
};
