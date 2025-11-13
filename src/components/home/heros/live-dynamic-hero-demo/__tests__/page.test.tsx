import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import type { ReactNode } from "react";
import "@testing-library/jest-dom";

import LiveDynamicHeroDemoPage from "../../live-dynamic-hero-demo/page";

const startTrialMock = jest.fn();
const closeCheckoutMock = jest.fn();
const playVideoMock = jest.fn();

jest.mock("@/components/home/heros/useHeroTrialCheckout", () => ({
	__esModule: true,
	useHeroTrialCheckout: () => ({
		isTrialLoading: false,
		checkoutState: null,
		startTrial: startTrialMock,
		closeCheckout: closeCheckoutMock,
	}),
}));

jest.mock("@/components/cta/PersonaCTA", () => {
	const React = require("react");
	return {
		__esModule: true,
		default: ({
			primary,
			secondary,
			onPrimaryClick,
			onSecondaryClick,
			primaryLoading,
			microcopy,
		}: {
			primary: { label: string };
			secondary: { label: string };
			onPrimaryClick?: () => void;
			onSecondaryClick?: () => void;
			primaryLoading?: boolean;
			microcopy?: string;
		}) => (
			<div>
				<button
					type="button"
					onClick={onPrimaryClick}
					disabled={primaryLoading}
					data-testid="primary-cta"
				>
					{primary.label}
				</button>
				<button type="button" onClick={onSecondaryClick}>
					{secondary.label}
				</button>
				{microcopy ? <p>{microcopy}</p> : null}
			</div>
		),
	};
});

jest.mock("@external/dynamic-hero", () => {
	const React = require("react");
	const resolveHeroCopy = jest.fn((input: unknown, fallback: unknown) =>
		input ?? fallback,
	);
	return {
		HeroAurora: ({ children }: { children?: ReactNode }) => (
			<div data-testid="hero-aurora">{children}</div>
		),
		HeroHeadline: () => <h1>Hero Headline</h1>,
		HeroVideoPreview: React.forwardRef((_, ref) => {
			React.useImperativeHandle(ref, () => ({
				play: playVideoMock,
			}));
			return <div data-testid="hero-video-preview" />;
		}),
		resolveHeroCopy,
		useHeroVideoConfig: jest.fn(),
	};
});

jest.mock("motion/react", () => ({
	useInView: () => true,
}));

beforeAll(() => {
	Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
		configurable: true,
		value: jest.fn(),
	});
	global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
		callback(0);
		return 0;
	};
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe("LiveDynamicHeroDemoPage", () => {
	it("renders CTA labels and supporting copy", () => {
		render(<LiveDynamicHeroDemoPage />);

		expect(screen.getByText("Get Started in 1 Click")).toBeInTheDocument();
		expect(screen.getByText(/Review the rollout steps/i)).toBeInTheDocument();
	});

	it("triggers Stripe trial checkout when primary CTA is clicked", () => {
		render(<LiveDynamicHeroDemoPage />);

		fireEvent.click(screen.getByTestId("primary-cta"));

		expect(startTrialMock).toHaveBeenCalledTimes(1);
	});

	it("scrolls to the video preview and plays it when secondary CTA is clicked", async () => {
		const scrollIntoView = jest.fn();
		(window.HTMLElement.prototype.scrollIntoView as jest.Mock).mockImplementation(
			scrollIntoView,
		);

		render(<LiveDynamicHeroDemoPage />);

		fireEvent.click(screen.getByRole("button", { name: /see how it works/i }));

		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "center",
		});
		await waitFor(() => expect(playVideoMock).toHaveBeenCalledTimes(1));
	});
});

