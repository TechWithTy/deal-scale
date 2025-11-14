import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import { BetaStickyBanner } from "../BetaStickyBanner";

describe("BetaStickyBanner", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		const fixedNow = new Date("2025-11-13T00:00:00Z");
		vi.setSystemTime(fixedNow);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders beta access CTA copy", () => {
		render(<BetaStickyBanner />);

		expect(
			screen.getByText(/founders circle access/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /request early access/i }),
		).toHaveAttribute("href", "/contact?utm_source=founders-circle");
	});

	it("updates countdown with remaining time", async () => {
		render(<BetaStickyBanner />);

		await act(async () => {
			vi.advanceTimersByTime(1000);
			await Promise.resolve();
		});

		expect(
			await screen.findByText(/6d 23h 59m 59s/i),
		).toBeInTheDocument();
	});
});

