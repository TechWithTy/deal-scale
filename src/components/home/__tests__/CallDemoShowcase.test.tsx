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

		expect(
			screen.getByRole("heading", {
				name: /turn conversations into conversions/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: /automate your follow-ups, not your relationships\./i,
			}),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/text demo preview/i)).toBeInTheDocument();
		expect(
			screen.getByText(/dealScale AI • Live Seller Outreach/i),
		).toBeInTheDocument();
		expect(screen.getByText(/iMessage Support/i)).toBeInTheDocument();
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
