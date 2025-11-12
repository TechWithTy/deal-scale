import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import type { ReactNode } from "react";
import "@testing-library/jest-dom";

import { resolveHeroCopy } from "../../../dynamic-hero/src";
import DynamicHeroDemoPage from "../DynamicHero";

jest.mock("lucide-react", () => ({
	ArrowDown: () => <svg data-testid="arrow-down" />,
}));

jest.mock(
	"@/components/ui/avatar-circles",
	() => ({
		AvatarCircles: () => <div data-testid="avatar-circles" />,
	}),
	{ virtual: true },
);

jest.mock(
	"@/components/ui/background-beams-with-collision",
	() => ({
		BackgroundBeamsWithCollision: ({ children }: { children?: ReactNode }) => (
			<div>{children}</div>
		),
	}),
	{ virtual: true },
);

jest.mock(
	"@/components/ui/light-rays",
	() => ({
		LightRays: () => <div data-testid="light-rays" />,
	}),
	{ virtual: true },
);

jest.mock(
	"@/components/ui/pointer",
	() => ({
		Pointer: ({ children }: { children?: ReactNode }) => (
			<div data-testid="pointer">{children}</div>
		),
	}),
	{ virtual: true },
);

jest.mock("../../../dynamic-hero/src", () => {
	const React = require("react");

	const mockResolveHeroCopy = jest.fn(
		(input: unknown, fallback: unknown) => input ?? fallback,
	);

	return {
		DEFAULT_HERO_SOCIAL_PROOF: {
			reviews: [],
			avatars: ["https://example.com/avatar.png"],
			numPeople: 1,
		},
		HeroAurora: ({ children }: { children?: ReactNode }) => (
			<div data-testid="hero-aurora">{children}</div>
		),
		HeroHeadline: ({
			personaLabel,
		}: {
			personaLabel: string;
		}) => <h1>{personaLabel}</h1>,
		PersonaCTA: ({
			primary,
			secondary,
			onPrimaryClick,
			onSecondaryClick,
			microcopy,
		}: {
			primary: { label: string };
			secondary: { label: string };
			onPrimaryClick?: () => void;
			onSecondaryClick?: () => void;
			microcopy?: string;
		}) => (
			<div>
				<button type="button" onClick={onPrimaryClick}>
					{primary.label}
				</button>
				<button type="button" onClick={onSecondaryClick}>
					{secondary.label}
				</button>
				{microcopy ? <p>{microcopy}</p> : null}
			</div>
		),
		HeroVideoPreview: () => <div data-testid="hero-video-preview" />,
		resolveHeroCopy: mockResolveHeroCopy,
		TextFlipHighlight: ({ children }: { children?: React.ReactNode }) => (
			<span>{children}</span>
		),
	};
});

describe("DynamicHeroDemoPage", () => {
	const resolveHeroCopyMock = resolveHeroCopy as jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders CTA labels and supporting copy", () => {
		render(<DynamicHeroDemoPage />);

		expect(screen.getByText("Launch Quick Start Hero")).toBeInTheDocument();
		expect(screen.getByText("Preview Guided Demo")).toBeInTheDocument();
		expect(
			screen.getByText(/Reusable hero experiences adopted by builders/i),
		).toBeInTheDocument();
	});

	it("scrolls to the details section when Next button is clicked", () => {
		const scrollIntoView = jest.fn();
		const getElementByIdSpy = jest
			.spyOn(document, "getElementById")
			.mockReturnValue({ scrollIntoView } as unknown as HTMLElement);

		render(<DynamicHeroDemoPage />);

		fireEvent.click(screen.getByRole("button", { name: /next/i }));

		expect(scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "start",
		});

		getElementByIdSpy.mockRestore();
	});

	it("initializes hero copy via resolveHeroCopy helper", () => {
		render(<DynamicHeroDemoPage />);

		expect(resolveHeroCopyMock).toHaveBeenCalledWith(
			expect.objectContaining({
				values: expect.objectContaining({
					problem: "manually stitching hero sections",
					solution: "reusing shared UI modules",
					fear: "launch delays creep in",
				}),
			}),
			expect.objectContaining({
				fallbackPrimaryChip: expect.objectContaining({
					label: "Shared UI Library",
				}),
			}),
		);
	});
});
