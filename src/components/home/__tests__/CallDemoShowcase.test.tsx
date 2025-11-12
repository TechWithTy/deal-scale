import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";

import { CallDemoShowcase } from "../CallDemoShowcase";
import React from "react";

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
		(global as any).IntersectionObserver = class {
			constructor() {}
			observe(): void {}
			unobserve(): void {}
			disconnect(): void {}
		};
	});

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
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
		expect(
			screen.getByText(/dealScale AI • Live Seller Outreach/i),
		).toBeInTheDocument();
		expect(screen.getByText(/iMessage Support/i)).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(4500);
		});

		const dialogText =
			screen.getByTestId("session-monitor-dialog").textContent?.toLowerCase() ??
			"";
		expect(dialogText.length).toBeGreaterThan(1);

		act(() => {
			jest.advanceTimersByTime(2500);
		});

		const statusText =
			screen.getByTestId("session-monitor-status").textContent?.toLowerCase() ??
			"";
		expect(statusText.length).toBeGreaterThan(1);
	});

	it("enables the call demo preview when requested", () => {
		render(<CallDemoShowcase />);

		fireEvent.click(screen.getByRole("button", { name: /start a call demo/i }));

		expect(screen.getByLabelText(/call demo preview/i)).toBeInTheDocument();
	});

	it("restarts the live call demo inside the phone when requested", async () => {
		render(<CallDemoShowcase />);

		fireEvent.click(screen.getByRole("button", { name: /start a call demo/i }));

		act(() => {
			jest.runOnlyPendingTimers();
		});

		await waitFor(() =>
			expect(screen.getByText(/speaking/i)).toBeInTheDocument(),
		);
	});
});
