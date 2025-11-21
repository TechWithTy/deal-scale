import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";

import React from "react";
import {
	resetPersonaStore,
	usePersonaStore,
} from "../../../stores/usePersonaStore";
import { CallDemoShowcase } from "../CallDemoShowcase";
import {
	QUICK_START_PERSONA_GOAL,
	QUICK_START_PERSONA_KEY,
} from "../heros/heroConfig";

describe("CallDemoShowcase", () => {
	beforeAll(() => {
		// Provide a minimal Audio implementation for the AudioManager
		// biome-ignore lint/suspicious/noExplicitAny: test shim
		(global as any).Audio = class {
			public loop = false;
			public preload = "auto";
			public currentTime = 0;
			play(): Promise<void> {
				return Promise.resolve();
			}
			pause(): void {}
			addEventListener(): void {}
			removeEventListener(): void {}
		};
		type MinimalIntersectionObserver = {
			observe: () => void;
			unobserve: () => void;
			disconnect: () => void;
		};
		type MinimalIntersectionObserverConstructor = new (
			callback: (
				entries: unknown[],
				observer: MinimalIntersectionObserver,
			) => void,
			options?: Record<string, unknown>,
		) => MinimalIntersectionObserver;
		const globalWithIntersectionObserver = globalThis as unknown as {
			IntersectionObserver: MinimalIntersectionObserverConstructor;
		};
		class TestIntersectionObserver implements MinimalIntersectionObserver {
			observe(): void {}
			unobserve(): void {}
			disconnect(): void {}
		}
		globalWithIntersectionObserver.IntersectionObserver =
			TestIntersectionObserver;
	});

	beforeEach(() => {
		vi.useFakeTimers();
		resetPersonaStore();
		usePersonaStore
			.getState()
			.setPersonaAndGoal(QUICK_START_PERSONA_KEY, QUICK_START_PERSONA_GOAL);
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it("renders outreach studio copy and text preview by default", () => {
		render(<CallDemoShowcase />);

		const introHeadings = screen.getAllByRole("heading", {
			name: /turn conversations into conversions/i,
		});
		expect(introHeadings.length).toBeGreaterThan(0);
		const sessionHeadings = screen.getAllByRole("heading", {
			name: /automate your follow-ups, not your relationships\./i,
		});
		expect(sessionHeadings.length).toBeGreaterThan(0);
		expect(screen.getByLabelText(/text demo preview/i)).toBeInTheDocument();
		expect(screen.getByText(/live text outreach/i)).toBeInTheDocument();
		expect(screen.getByText(/iMessage Support/i)).toBeInTheDocument();
		expect(
			screen.getAllByText(/Automate deal flow conversations/i).length,
		).toBeGreaterThan(0);

		act(() => {
			vi.advanceTimersByTime(4500);
		});

		const dialogText =
			screen.getByTestId("session-monitor-dialog").textContent?.toLowerCase() ??
			"";
		expect(dialogText.length).toBeGreaterThan(1);

		act(() => {
			vi.advanceTimersByTime(2500);
		});

		const statusText =
			screen.getByTestId("session-monitor-status").textContent?.toLowerCase() ??
			"";
		expect(statusText.length).toBeGreaterThan(1);
	});

	it("enables the call demo preview when requested", () => {
		render(<CallDemoShowcase />);

		fireEvent.click(
			screen.getAllByRole("button", { name: /start a call demo/i })[0],
		);

		expect(screen.getByLabelText(/call demo preview/i)).toBeInTheDocument();
	});

	it("restarts the live call demo inside the phone when requested", async () => {
		render(<CallDemoShowcase />);

		fireEvent.click(
			screen.getAllByRole("button", { name: /start a call demo/i })[0],
		);

		act(() => {
			vi.runOnlyPendingTimers();
		});

		await waitFor(() =>
			expect(screen.getByText(/speaking/i)).toBeInTheDocument(),
		);
	});
});
