import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PixelatedVoiceCloneCard } from "../pixelated-voice-clone-card";
import type * as textRevealCardModule from "../text-reveal-card";

const mockPixelatedCanvas = vi.fn((props: Record<string, unknown>) => (
	<div data-testid="pixelated-canvas" />
));

const textRevealSpies: {
	props?: Record<string, unknown>;
	children?: ReactNode;
} = {};

const originalFileReader = globalThis.FileReader;

class ImmediateFileReader {
	onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
	onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;

	readAsDataURL(): void {
		this.onload?.({
			target: { result: "data:mock" },
		} as unknown as ProgressEvent<FileReader>);
	}
}

const originalResizeObserver = globalThis.ResizeObserver;
const originalMatchMedia = globalThis.matchMedia;
let resizeCallbacks: ResizeObserverCallback[] = [];
let mockObserverInstances: ResizeObserver[] = [];
const fallbackObserver: ResizeObserver = {
	observe: () => {},
	unobserve: () => {},
	disconnect: () => {},
};

const createObserverEntry = (width: number): ResizeObserverEntry => {
	const height = 1;
	const size = { inlineSize: width, blockSize: height } as ResizeObserverSize;
	return {
		borderBoxSize: [size],
		contentBoxSize: [size],
		devicePixelContentBoxSize: [],
		contentRect: new DOMRectReadOnly(0, 0, width, height),
		target: document.createElement("div"),
	} as ResizeObserverEntry;
};

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
		resizeCallbacks = [];
		mockObserverInstances = [];
		globalThis.FileReader = ImmediateFileReader as unknown as typeof FileReader;
		const mockMatchMedia = vi
			.fn((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(() => false),
			}))
			.mockName("matchMedia");
		globalThis.matchMedia =
			mockMatchMedia as unknown as typeof globalThis.matchMedia;

		class MockResizeObserver implements ResizeObserver {
			private readonly callback: ResizeObserverCallback;

			constructor(callback: ResizeObserverCallback) {
				this.callback = callback;
				resizeCallbacks.push(callback);
				mockObserverInstances.push(this);
			}

			disconnect(): void {
				// no-op for tests
			}

			observe(_target: Element, _options?: ResizeObserverOptions): void {
				// no-op for tests
			}

			unobserve(_target: Element): void {
				// no-op for tests
			}
		}

		globalThis.ResizeObserver = MockResizeObserver;
	});

	afterEach(() => {
		globalThis.ResizeObserver = originalResizeObserver;
		globalThis.FileReader = originalFileReader;
		globalThis.matchMedia = originalMatchMedia;
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

	it("resizes the canvas when the container width changes", async () => {
		render(<PixelatedVoiceCloneCard />);

		await waitFor(() => {
			expect(resizeCallbacks.length).toBeGreaterThan(0);
		});

		for (const callback of resizeCallbacks) {
			const observerInstance = mockObserverInstances[0] ?? fallbackObserver;
			callback([createObserverEntry(600)], observerInstance);
		}

		await waitFor(() => {
			expect(mockPixelatedCanvas).toHaveBeenLastCalledWith(
				expect.objectContaining({
					width: 600,
					height: 350,
					responsive: true,
				}),
			);
		});
	});

	it("enables auto animation when the user interacts with the clone", async () => {
		const user = userEvent.setup();
		render(<PixelatedVoiceCloneCard />);

		await user.click(
			screen.getByRole("button", { name: /interact with clone/i }),
		);

		await waitFor(() => {
			const lastCall = mockPixelatedCanvas.mock.calls.at(-1)?.[0] as
				| Record<string, unknown>
				| undefined;
			expect(lastCall?.autoAnimate).toBe(true);
			expect(lastCall?.distortionStrength).toBeCloseTo(3.75, 2);
		});
	});

	it("auto animates the canvas after a successful image upload", async () => {
		const user = userEvent.setup();
		render(<PixelatedVoiceCloneCard />);

		const fileInput = screen.getByLabelText(
			/Upload a PNG of your portrait/i,
		) as HTMLInputElement;
		const file = new File(["mock"], "portrait.png", { type: "image/png" });

		await user.upload(fileInput, file);

		await waitFor(() => {
			const lastCall = mockPixelatedCanvas.mock.calls.at(-1)?.[0] as
				| Record<string, unknown>
				| undefined;
			expect(lastCall?.autoAnimate).toBe(true);
			expect(lastCall?.distortionStrength).toBeCloseTo(3.3, 2);
		});
	});

	it("fits the pixelated canvas inside the mobile container", async () => {
		render(<PixelatedVoiceCloneCard />);

		await waitFor(() => {
			const lastCall = mockPixelatedCanvas.mock.calls.at(-1)?.[0] as
				| Record<string, unknown>
				| undefined;
			expect(lastCall).toMatchObject({
				width: expect.any(Number),
				height: expect.any(Number),
			});
			const width = Number(lastCall?.width);
			const height = Number(lastCall?.height);
			expect(width).toBeGreaterThan(200);
			expect(width).toBeLessThanOrEqual(400);
			expect(height).toBeGreaterThan(300);
		});
	});
});
