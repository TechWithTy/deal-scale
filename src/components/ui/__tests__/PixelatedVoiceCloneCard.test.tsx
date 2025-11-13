import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PixelatedVoiceCloneCard } from "../pixelated-voice-clone-card";
import type * as textRevealCardModule from "../text-reveal-card";

const mockPixelatedCanvas = vi.fn((props: Record<string, unknown>) => (
	<div data-testid="pixelated-canvas" />
));

const textRevealSpies: {
	props?: Record<string, unknown>;
	children?: ReactNode;
} = {};

vi.mock("@/components/ui/pixelated-canvas", () => ({
	__esModule: true,
	PixelatedCanvas: (props: Record<string, unknown>) =>
		mockPixelatedCanvas(props),
}));

vi.mock("@/components/ui/text-reveal-card", () => ({
	__esModule: true,
	TextRevealCard: ({
		children,
		...rest
	}: ComponentProps<typeof textRevealCardModule.TextRevealCard>) => {
		textRevealSpies.props = rest;
		textRevealSpies.children = children;
		return <div data-testid="text-reveal-card">{children}</div>;
	},
	TextRevealCardTitle: ({
		children,
	}: ComponentProps<typeof textRevealCardModule.TextRevealCardTitle>) => (
		<div data-testid="text-reveal-card-title">{children}</div>
	),
	TextRevealCardDescription: ({
		children,
	}: ComponentProps<typeof textRevealCardModule.TextRevealCardDescription>) => (
		<div data-testid="text-reveal-card-description">{children}</div>
	),
}));

describe("PixelatedVoiceCloneCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		textRevealSpies.props = undefined;
		textRevealSpies.children = undefined;
	});

	it("renders the pixelated canvas with the expected defaults", async () => {
		render(<PixelatedVoiceCloneCard />);

		await waitFor(() => {
			expect(mockPixelatedCanvas).toHaveBeenCalled();
		});

		expect(mockPixelatedCanvas).toHaveBeenCalledWith(
			expect.objectContaining({
				src: "https://assets.aceternity.com/manu-red.png",
				distortionMode: "swirl",
				interactive: false,
				className: expect.stringContaining("rounded-3xl"),
			}),
		);
	});

	it("shows before and after voice cloning messaging", () => {
		render(<PixelatedVoiceCloneCard />);

		expect(
			screen.getByText(/Flat, robotic delivery that breaks connection\./i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Expressive, human tone that builds trust instantly\./i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				name: "Your AI Clone: Authentic, Expressive, Unmistakably You",
			}),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/upload a png/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Photo-to-video avatar tooling coming soon/i),
		).toBeInTheDocument();
	});

	it("uses TextRevealCard to describe the cloning experience", () => {
		render(<PixelatedVoiceCloneCard />);

		expect(screen.getByTestId("text-reveal-card")).toBeInTheDocument();
		expect(textRevealSpies.props).toMatchObject({
			text: "Clone your voice in minutes",
			revealText: "Sound unmistakably like you.",
		});
		expect(
			screen.getByText(/Hover to see how we build authenticity at scale\./i),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Track the shift from robotic to expressive delivery in real time\./i,
			),
		).toBeInTheDocument();
	});
});
