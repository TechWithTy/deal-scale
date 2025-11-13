import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import type { ReactNode } from "react";
import "@testing-library/jest-dom";

const startTrialMock = vi.fn(() => Promise.resolve());
const closeCheckoutMock = vi.fn();
const playVideoMock = vi.fn();

vi.mock("@/components/home/heros/useHeroTrialCheckout", () => ({
	__esModule: true,
	useHeroTrialCheckout: () => ({
		isTrialLoading: false,
		checkoutState: null,
		startTrial: startTrialMock,
		closeCheckout: closeCheckoutMock,
	}),
}));

vi.mock("@/components/cta/PersonaCTA", () => ({
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
}));

vi.mock("@/components/ui/avatar-circles", () => ({
	AvatarCircles: () => <div data-testid="avatar-circles" />,
}));

vi.mock("@external/dynamic-hero", () => {
	const React = require("react");
	const resolveHeroCopy = vi.fn((input: unknown, fallback: unknown) =>
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
		DEFAULT_HERO_SOCIAL_PROOF: { badges: [], testimonials: [] },
		resolveHeroCopy,
		useHeroVideoConfig: vi.fn(),
	};
});

vi.mock("motion/react", () => ({
	useInView: () => true,
}));

let LiveDynamicHeroDemoPage: typeof import("../../live-dynamic-hero-demo/page")
	.default;

beforeAll(async () => {
	Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn(),
	});
	Object.defineProperty(globalThis, "IntersectionObserver", {
		writable: true,
		value: class {
			readonly root: Element | Document | null = null;
			readonly rootMargin = "0px";
			readonly thresholds = [0];
			constructor(private readonly callback: IntersectionObserverCallback) {}
			disconnect(): void {
				// noop
			}
			observe(target: Element): void {
				this.callback(
					[
						{
							target,
							isIntersecting: true,
							intersectionRatio: 1,
						} as IntersectionObserverEntry,
					],
					this as unknown as IntersectionObserver,
				);
			}
			takeRecords(): IntersectionObserverEntry[] {
				return [];
			}
			unobserve(_target: Element): void {
				// noop
			}
		},
	});
	globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number => {
		callback(0);
		return 0;
	};
	LiveDynamicHeroDemoPage = (
		await import("../../live-dynamic-hero-demo/page")
	).default;
});

beforeEach(() => {
	vi.clearAllMocks();
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
		const scrollIntoView = vi.fn();
		(window.HTMLElement.prototype.scrollIntoView as unknown as Mock).mockImplementation(
			scrollIntoView,
		);

		render(<LiveDynamicHeroDemoPage />);

		fireEvent.click(
			screen.getByRole("button", { name: /see how it works/i }),
		);

		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "center",
		});
		await waitFor(() => expect(playVideoMock).toHaveBeenCalledTimes(1));
	});
});

