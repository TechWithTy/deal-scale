import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeAll } from "vitest";

import { AnimatedBeamNetwork } from "../animated-beam-network";

class MockResizeObserver {
	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	observe(): void {}
	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	disconnect(): void {}
	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	unobserve(): void {}
}

describe("AnimatedBeamNetwork", () => {
	beforeAll(() => {
		global.ResizeObserver =
			MockResizeObserver as unknown as typeof ResizeObserver;
	});

	it("renders provided title and description", () => {
		render(
			<AnimatedBeamNetwork
				title="Test Integrations"
				description="Custom network description"
				centerLabel="AI Core"
				nodes={[
					{
						id: "alpha",
						label: "Alpha",
						icon: <span data-testid="alpha-icon">A</span>,
					},
					{
						id: "beta",
						label: "Beta",
						icon: <span data-testid="beta-icon">B</span>,
					},
				]}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "Test Integrations" }),
		).toBeInTheDocument();
		expect(screen.getByText("Custom network description")).toBeInTheDocument();
		expect(screen.getByLabelText("Alpha")).toBeInTheDocument();
		expect(screen.getByLabelText("Beta")).toBeInTheDocument();
		expect(screen.getByText("AI Core")).toBeInTheDocument();
	});
});
