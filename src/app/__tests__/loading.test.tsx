"use client";

import Loading from "../loading";
import { render, screen } from "@testing-library/react";

describe("app/loading", () => {
	it("exposes an accessible loading spinner label", () => {
		render(<Loading />);

		expect(
			screen.getByLabelText("Loading Deal Scale experience"),
		).toBeInTheDocument();
		expect(screen.getByTestId("loading-animation")).toHaveAttribute(
			"aria-live",
			"assertive",
		);
	});
});
import { render, screen } from "@testing-library/react";

describe("App route loading fallback", () => {
	it("renders a status-aware loading animation", async () => {
		const { default: Loading } = await import("@/app/loading");

		render(<Loading />);

		const spinner = screen.getByRole("status", { name: /loading/i });
		expect(spinner).toBeInTheDocument();
		expect(screen.getByTestId("loading-animation")).toContainElement(spinner);
	});
});

