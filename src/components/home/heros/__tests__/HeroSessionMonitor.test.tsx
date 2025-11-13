import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import HeroSessionMonitor from "../HeroSessionMonitor";

vi.mock("next/dynamic", async () => {
	const ReactModule = await vi.importActual<typeof import("react")>("react");
	return {
		__esModule: true,
		default: (
			_importer: () => Promise<unknown>,
			options?: { loading?: React.ComponentType },
		) => {
			const Loading = options?.loading;
			const DynamicComponent = (props: Record<string, unknown>) =>
				Loading ? ReactModule.createElement(Loading, props) : null;
			DynamicComponent.displayName = "DynamicComponentMock";
			return DynamicComponent;
		},
	};
});

vi.mock("framer-motion", async () => {
	const ReactModule = await vi.importActual<typeof import("react")>("react");
	const createMock =
		(tag: keyof JSX.IntrinsicElements) =>
		({ children, ...props }: { children?: React.ReactNode }) =>
			ReactModule.createElement(tag, props, children);

	return {
		__esModule: true,
		motion: {
			span: createMock("span"),
			div: createMock("div"),
		},
	};
});

describe("HeroSessionMonitor", () => {
	it("renders badge and CTA buttons without runtime errors", () => {
		render(
			<HeroSessionMonitor
				headline="Test headline"
				subheadline="Discover real-time insights with analytics"
				badge="Beta access"
				ctaLabel="Primary CTA"
				ctaLabel2="Secondary CTA"
				onCtaClick={() => undefined}
				onCtaClick2={() => undefined}
			/>,
		);

		expect(screen.getByText("Beta access")).toBeInTheDocument();
		expect(screen.getByText("Primary CTA")).toBeInTheDocument();
		expect(screen.getByText("Secondary CTA")).toBeInTheDocument();
	});

	it("applies responsive container sizing classes", () => {
		const { container } = render(
			<HeroSessionMonitor headline="Responsive headline" subheadline="" />,
		);

		const section = container.querySelector("section");

		expect(section).not.toBeNull();
		expect(section).toHaveClass("mx-auto");
		expect(section).toHaveClass("w-full");
		expect(section).toHaveClass("max-w-[calc(100vw-3rem)]");
		expect(section).toHaveClass("sm:max-w-2xl");
		expect(section).toHaveClass("md:max-w-3xl");
		expect(section).toHaveClass("lg:max-w-5xl");
		expect(section).toHaveClass("items-center");
	});

	it("does not clamp the hero to the old extra-small width", () => {
		const { container } = render(
			<HeroSessionMonitor
				headline="Viewport friendly headline"
				subheadline=""
			/>,
		);

		const section = container.querySelector("section");

		expect(section).not.toBeNull();
		expect(section).not.toHaveClass("max-w-xs");
		expect(section).toHaveClass("max-w-[calc(100vw-3rem)]");
	});

	it("allows the session monitor carousel to shrink on mobile while expanding responsively", () => {
		render(<HeroSessionMonitor headline="Carousel headline" subheadline="" />);

		const carousel = screen.getByTestId("session-monitor-carousel");

		expect(carousel).toHaveClass("mx-auto");
		expect(carousel).toHaveClass("w-full");
		expect(carousel).toHaveClass("max-w-[calc(100vw-3rem)]");
		expect(carousel).toHaveClass("sm:max-w-[calc(100vw-4rem)]");
		expect(carousel).toHaveClass("md:max-w-4xl");

		const track = carousel.firstElementChild as HTMLElement | null;

		expect(track).not.toBeNull();
		const trackEl = track as HTMLElement;
		expect(trackEl).toHaveClass("w-full");
		expect(trackEl).toHaveClass("max-w-[calc(100vw-3rem)]");
		expect(trackEl).toHaveClass("sm:max-w-[calc(100vw-4rem)]");
		expect(trackEl).toHaveClass("md:max-w-4xl");

		const card = trackEl.firstElementChild as HTMLElement | null;

		expect(card).not.toBeNull();
		const cardEl = card as HTMLElement;
		expect(cardEl).toHaveClass("w-full");
		expect(cardEl).toHaveClass("max-w-[calc(100vw-3rem)]");
		expect(cardEl).toHaveClass("sm:max-w-md");
		expect(cardEl).toHaveClass("md:max-w-4xl");
	});
});
