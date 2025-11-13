import { render, screen, waitFor } from "@testing-library/react";

const mockPixelatedCanvas = jest.fn(() => (
	<div data-testid="pixelated-canvas" />
));

const textRevealSpies: {
	props?: Record<string, unknown>;
	children?: React.ReactNode;
} = {};

jest.mock("@/components/ui/pixelated-canvas", () => ({
	__esModule: true,
	PixelatedCanvas: (props: Record<string, unknown>) =>
		mockPixelatedCanvas(props),
}));

jest.mock("@/components/ui/text-reveal-card", () => {
	const actual = jest.requireActual("@/components/ui/text-reveal-card");
	return {
		__esModule: true,
		TextRevealCard: ({
			children,
			...rest
		}: React.ComponentProps<typeof actual.TextRevealCard>) => {
			textRevealSpies.props = rest;
			textRevealSpies.children = children;
			return <div data-testid="text-reveal-card">{children}</div>;
		},
		TextRevealCardTitle: ({
			children,
		}: React.ComponentProps<typeof actual.TextRevealCardTitle>) => (
			<div data-testid="text-reveal-card-title">{children}</div>
		),
		TextRevealCardDescription: ({
			children,
		}: React.ComponentProps<typeof actual.TextRevealCardDescription>) => (
			<div data-testid="text-reveal-card-description">{children}</div>
		),
	};
});

describe("PixelatedVoiceCloneCard", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		textRevealSpies.props = undefined;
		textRevealSpies.children = undefined;
	});

	it("renders the pixelated canvas with the expected defaults", async () => {
		const {
			PixelatedVoiceCloneCard,
		} = require("../pixelated-voice-clone-card");

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
		const {
			PixelatedVoiceCloneCard,
		} = require("../pixelated-voice-clone-card");

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
		const {
			PixelatedVoiceCloneCard,
		} = require("../pixelated-voice-clone-card");

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
