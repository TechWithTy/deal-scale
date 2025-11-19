import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { act } from "react";

import type { ResolvedHeroCopy } from "../../utils/copy";
import * as HeroHeadlineModule from "../hero-headline";

vi.mock("@/components/ui/avatar-circles", () => ({
	AvatarCircles: () => null,
}));

vi.mock("@/components/ui/globe", () => ({
	Globe: () => null,
}));

vi.mock("motion/react", async () => {
	const React = await vi.importActual<typeof import("react")>("react");

	return {
		__esModule: true,
		AnimatePresence: ({ children }: { children: React.ReactNode }) => (
			<>{children}</>
		),
		motion: new Proxy(
			{},
			{
				get: (_, key: string) => {
					const Component = (props: React.ComponentPropsWithoutRef<"div">) => (
						<div data-motion-component={key} {...props} />
					);
					Component.displayName = `motion.${key}`;
					return Component;
				},
			},
		),
	};
});

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

describe("useRotatingIndex", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("pauses and resumes rotation when toggling isActive", () => {
		const values = ["first", "second"];

		const Harness = ({ isActive }: { isActive: boolean }) => {
			const index = HeroHeadlineModule.useRotatingIndex(values, 1000, isActive);
			return <span data-testid="active-value">{values[index]}</span>;
		};

		const { rerender } = render(<Harness isActive={false} />);

		const value = () => screen.getByTestId("active-value");

		expect(value().textContent).toBe("first");

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(value().textContent).toBe("first");

		rerender(<Harness isActive={true} />);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(value().textContent).toBe("second");

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(value().textContent).toBe("first");
	});
});
