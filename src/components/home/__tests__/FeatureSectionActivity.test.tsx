import { act, render, screen } from "@testing-library/react";
import React from "react";

import { activityStream } from "@/data/activity/activityStream";
import FeatureSectionActivity from "../FeatureSectionActivity";

jest.mock("@/components/ui/card-stack", () => {
	const React = require("react") as typeof import("react");

	return {
		__esModule: true,
		CardStack: ({
			items,
		}: {
			items: Array<{ id: number; content: React.ReactNode }>;
		}) => (
			<div data-testid="card-stack">
				{items.map((item) => (
					<div key={item.id} data-testid="card-stack-item">
						{item.content}
					</div>
				))}
			</div>
		),
	};
});

jest.mock("@/components/ui/glare-card", () => {
	const React = require("react") as typeof import("react");

	return {
		__esModule: true,
		GlareCard: ({
			children,
			className,
		}: {
			children: React.ReactNode;
			className?: string;
		}) =>
			React.createElement(
				"div",
				{ className, "data-testid": "glare-card" },
				children,
			),
	};
});

jest.mock("@/components/ui/ClientLottie", () => ({
	__esModule: true,
	default: () => <div data-testid="client-lottie" />,
}));

const setupMatchMedia = (prefersReducedMotion = false) => {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: jest.fn().mockImplementation((query: string) => ({
			matches: prefersReducedMotion && query.includes("prefers-reduced-motion"),
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			addListener: jest.fn(),
			removeListener: jest.fn(),
			dispatchEvent: jest.fn(),
		})),
	});
};

describe("FeatureSectionActivity", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		setupMatchMedia(false);
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("renders a card stack item for every activity event", () => {
		render(<FeatureSectionActivity />);

		const cardItems = screen.getAllByTestId("card-stack-item");

		expect(cardItems).toHaveLength(activityStream.length);
		const actorOccurrences = screen.getAllByText(
			activityStream[0]?.actor ?? "",
		);

		expect(actorOccurrences.length).toBeGreaterThan(0);
	});

	it("cycles the highlighted activity on an interval", () => {
		render(<FeatureSectionActivity />);

		const highlight = screen.getByTestId("activity-highlight");

		expect(highlight).toHaveTextContent(activityStream[0]?.action ?? "");

		act(() => {
			jest.advanceTimersByTime(3200);
		});

		expect(highlight).toHaveTextContent(activityStream[1]?.action ?? "");
	});

	it("respects prefers-reduced-motion by freezing the rotation", () => {
		setupMatchMedia(true);

		render(<FeatureSectionActivity />);

		const highlight = screen.getByTestId("activity-highlight");

		expect(highlight).toHaveTextContent(activityStream[0]?.action ?? "");

		act(() => {
			jest.advanceTimersByTime(6000);
		});

		expect(highlight).toHaveTextContent(activityStream[0]?.action ?? "");
	});
});
