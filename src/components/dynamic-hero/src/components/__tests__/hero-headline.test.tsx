import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";

import { HeroHeadline, useRotatingIndex } from "../hero-headline";
import type { ResolvedHeroCopy } from "../../utils/copy";

jest.mock("@/components/ui/avatar-circles", () => ({
	AvatarCircles: () => null,
}));

jest.mock("@/components/ui/globe", () => ({
	Globe: () => null,
}));

const MOCK_COPY: ResolvedHeroCopy = {
	title: "Stop manually auditing deals — before the next opportunity slips.",
	subtitle: "Investors scale their deal flow in under 5 minutes.",
	values: {
		problem: "manually auditing deals",
		solution: "automating investor follow-up",
		fear: "missing the next flip",
		socialProof: "Investors trust DealScale",
		benefit: "to automate lead nurturing",
		time: "5",
		hope: "your next deal books itself",
	},
	rotations: {
		problems: ["manually auditing deals", "chasing spreadsheets all night"],
		solutions: [
			"automating investor follow-up",
			"rolling out AI sales coworkers",
		],
		fears: ["missing the next flip", "watching the pipeline dry up"],
	},
	chips: {},
};

describe("HeroHeadline rotation control", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("avoids scheduling intervals when animations are paused", () => {
		const setIntervalSpy = jest.spyOn(global, "setInterval");

		const firstRender = render(
			<HeroHeadline
				copy={MOCK_COPY}
				showChips={false}
				showSocialProof={false}
				reviews={[]}
				isAnimating={false}
			/>,
		);

		expect(setIntervalSpy).not.toHaveBeenCalled();

		firstRender.unmount();
		setIntervalSpy.mockClear();

		const secondRender = render(
			<HeroHeadline
				copy={MOCK_COPY}
				showChips={false}
				showSocialProof={false}
				reviews={[]}
				isAnimating={true}
			/>,
		);

		expect(setIntervalSpy.mock.calls.length).toBeGreaterThanOrEqual(3);

		secondRender.unmount();
		setIntervalSpy.mockRestore();
	});
});

describe("useRotatingIndex", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("pauses and resumes rotation when toggling isActive", () => {
		const values = ["first", "second"];

		const Harness = ({ isActive }: { isActive: boolean }) => {
			const index = useRotatingIndex(values, 1000, isActive);
			return <span data-testid="active-value">{values[index]}</span>;
		};

		const { rerender } = render(<Harness isActive={false} />);

		const value = () => screen.getByTestId("active-value");

		expect(value().textContent).toBe("first");

		act(() => {
			jest.advanceTimersByTime(5000);
		});

		expect(value().textContent).toBe("first");

		rerender(<Harness isActive={true} />);

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(value().textContent).toBe("second");

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(value().textContent).toBe("first");
	});
});

