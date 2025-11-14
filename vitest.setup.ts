import "dotenv/config";
import nodeFetch, {
	Headers as NodeHeaders,
	Request as NodeRequest,
	Response as NodeResponse,
} from "node-fetch";
import "@testing-library/jest-dom";
import * as React from "react";
import { afterAll, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@plausible-analytics/tracker", () => ({
	__esModule: true,
	init: vi.fn(),
	trackEvent: vi.fn(),
	trackPageview: vi.fn(),
	enableAutoPageviews: vi.fn(),
}));

vi.mock("posthog-js", () => ({
	__esModule: true,
	init: vi.fn(),
	capture: vi.fn(),
	identify: vi.fn(),
	reset: vi.fn(),
}));

vi.mock("@posthog/js-lite", () => ({
	__esModule: true,
	init: vi.fn(),
	capture: vi.fn(),
	identify: vi.fn(),
	reset: vi.fn(),
}));

const ensureJestFacade = () => {
	if (typeof globalThis.jest !== "undefined") {
		return;
	}

	const moduleMockRegistry = new Map<string, unknown>();
	const originalMock = vi.mock.bind(vi);

	const jestMock: typeof vi.mock = (...args) => {
		const [moduleId, factory, options] = args;

		if (typeof factory === "function") {
			return originalMock(
				moduleId,
				() => {
					const mockedModule = factory();
					moduleMockRegistry.set(moduleId, mockedModule);
					return mockedModule;
				},
				options,
			);
		}

		moduleMockRegistry.delete(moduleId);
		return originalMock(...args);
	};

	const requireMock = <T = unknown>(moduleId: string): T => {
		if (!moduleMockRegistry.has(moduleId)) {
			throw new Error(
				"Module has not been registered via jest.mock(). Provide a factory when mocking under Vitest so the adapter can expose it synchronously.",
			);
		}

		return moduleMockRegistry.get(moduleId) as T;
	};

	const clearRegistry = () => moduleMockRegistry.clear();

	const jestFacade = {
		mock: jestMock,
		doMock: vi.doMock.bind(vi),
		unmock: vi.unmock.bind(vi),
		mocked: vi.mocked.bind(vi),
		isMockFunction: vi.isMockFunction.bind(vi),
		requireActual: () => {
			throw new Error(
				"jest.requireActual is not supported by the Vitest compatibility shim. Import the module directly instead.",
			);
		},
		requireMock,
		resetModules: () => {
			clearRegistry();
			vi.resetModules();
		},
		setTimeout: (timeout: number) => {
			if (
				typeof (vi as unknown as { setTimeout?: (ms: number) => void })
					.setTimeout === "function"
			) {
				(vi as unknown as { setTimeout: (ms: number) => void }).setTimeout(
					timeout,
				);
			} else {
				return undefined;
			}
		},
		clearAllMocks: () => {
			clearRegistry();
			vi.clearAllMocks();
		},
		resetAllMocks: () => {
			clearRegistry();
			vi.resetAllMocks();
		},
		restoreAllMocks: () => {
			clearRegistry();
			vi.restoreAllMocks();
		},
		useFakeTimers: vi.useFakeTimers.bind(vi),
		useRealTimers: vi.useRealTimers.bind(vi),
		runOnlyPendingTimers: vi.runOnlyPendingTimers.bind(vi),
		advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
		clearAllTimers: vi.clearAllTimers.bind(vi),
		spyOn: vi.spyOn.bind(vi),
		fn: vi.fn.bind(vi),
		expect,
	};

	(globalThis as Record<string, unknown>).jest = jestFacade;
};

ensureJestFacade();

(globalThis as Record<string, unknown>).React = React;

if (typeof globalThis.fetch === "undefined") {
	globalThis.fetch = nodeFetch as unknown as typeof globalThis.fetch;
}

if (typeof globalThis.Request === "undefined") {
	globalThis.Request = NodeRequest as unknown as typeof globalThis.Request;
	globalThis.Response = NodeResponse as unknown as typeof globalThis.Response;
	globalThis.Headers = NodeHeaders as unknown as typeof globalThis.Headers;
}

afterAll(async () => {
	const agent = (
		globalThis.fetch as unknown as {
			__agent?: { destroy?: () => void };
		}
	)?.__agent;

	if (agent && typeof agent.destroy === "function") {
		agent.destroy();
	}
});
