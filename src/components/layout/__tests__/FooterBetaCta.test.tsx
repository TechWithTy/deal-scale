import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { FooterBetaCta } from "../FooterBetaCta";

describe("FooterBetaCta", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-11-13T00:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders countdown messaging and CTA link", async () => {
		render(<FooterBetaCta />);

		expect(screen.getByText(/Founders Circle/i)).toBeInTheDocument();
		expect(await screen.findByText(/Closes in/i)).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /request early access/i }),
		).toHaveAttribute(
			"href",
			"/contact?utm_source=founders-circle-footer",
		);
	});

	it("updates countdown timer", async () => {
		render(<FooterBetaCta />);

		await act(async () => {
			vi.advanceTimersByTime(1000);
			await Promise.resolve();
		});

		expect(await screen.findByText(/6d 23h 59m 59s/i)).toBeInTheDocument();
	});
});

