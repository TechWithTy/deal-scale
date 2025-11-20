import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import type { ReactNode } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { resetPersonaStore, usePersonaStore } from "@/stores/usePersonaStore";
import { resolveHeroCopy } from "../../../dynamic-hero/src";
import DynamicHeroDemoPage from "../DynamicHero";
import {
	QUICK_START_PERSONA_GOAL,
	QUICK_START_PERSONA_KEY,
} from "../heroConfig";

const pricingCheckoutDialogMock = vi.fn(
	({ clientSecret }: { clientSecret: string }) => (
		<div data-testid="pricing-checkout-dialog">{clientSecret}</div>
	),
);

vi.mock("@/components/home/pricing/PricingCheckoutDialog", async () => {
	const ReactModule = await vi.importActual<typeof import("react")>("react");
	return {
		__esModule: true,
		default: (props: { clientSecret: string }) => {
			pricingCheckoutDialogMock(props);
			return ReactModule.createElement(
				"div",
				{ "data-testid": "pricing-checkout-dialog" },
				props.clientSecret ?? "",
			);
		},
	};
});

const toastModuleMock = vi.hoisted(() => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("react-hot-toast", () => toastModuleMock);

vi.mock("lucide-react", () => ({
	ArrowDown: () => <svg data-testid="arrow-down" />,
}));

vi.mock(
	"@/components/ui/avatar-circles",
	() => ({
		AvatarCircles: () => <div data-testid="avatar-circles" />,
	}),
	{ virtual: true },
);

vi.mock(
	"@/components/ui/background-beams-with-collision",
	() => ({
		BackgroundBeamsWithCollision: ({ children }: { children?: ReactNode }) => (
			<div>{children}</div>
		),
	}),
	{ virtual: true },
);

vi.mock(
	"@/components/ui/light-rays",
	() => ({
		LightRays: () => <div data-testid="light-rays" />,
	}),
	{ virtual: true },
);

vi.mock(
	"@/components/ui/pointer",
	() => ({
		Pointer: ({ children }: { children?: ReactNode }) => (
			<div data-testid="pointer">{children}</div>
		),
	}),
	{ virtual: true },
);

const heroModuleMocks = vi.hoisted(() => {
	return {
		resolveHeroCopy: vi.fn(
			(input: unknown, fallback: unknown) => input ?? fallback,
		),
		playVideo: vi.fn(),
		stopVideo: vi.fn(),
	};
});

vi.mock("../../../dynamic-hero/src", async () => {
	const ReactModule = await vi.importActual<typeof import("react")>("react");
	return {
		DEFAULT_HERO_SOCIAL_PROOF: {
			reviews: [],
			avatars: ["https://example.com/avatar.png"],
			numPeople: 1,
		},
		HeroAurora: ({ children }: { children?: ReactNode }) => (
			<div data-testid="hero-aurora">{children}</div>
		),
		HeroHeadline: ({ personaLabel }: { personaLabel: string }) => (
			<h1>{personaLabel}</h1>
		),
		PersonaCTA: ({
			primary,
			secondary,
			onPrimaryClick,
			onSecondaryClick,
			microcopy,
			primaryLoading,
		}: {
			primary: { label: string };
			secondary: { label: string };
			onPrimaryClick?: () => void;
			onSecondaryClick?: () => void;
			microcopy?: string;
			primaryLoading?: boolean;
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
		HeroVideoPreview: ReactModule.forwardRef((_, ref) => {
			ReactModule.useImperativeHandle(ref, () => ({
				play: heroModuleMocks.playVideo,
				stop: heroModuleMocks.stopVideo,
			}));
			return <div data-testid="hero-video-preview" />;
		}),
		resolveHeroCopy: heroModuleMocks.resolveHeroCopy,
		TextFlipHighlight: ({ children }: { children?: React.ReactNode }) => (
			<span>{children}</span>
		),
		__videoPlayMock: heroModuleMocks.playVideo,
	};
});

describe("DynamicHeroDemoPage", () => {
	const resolveHeroCopyMock = vi.mocked(resolveHeroCopy);
	const toast = toastModuleMock.default;
	const mockFetch = vi.fn();
	const scrollIntoViewMock = vi.fn();

	beforeAll(() => {
		Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
			configurable: true,
			value: scrollIntoViewMock,
		});
	});

	beforeEach(() => {
		vi.clearAllMocks();
		mockFetch.mockReset();
		scrollIntoViewMock.mockReset();
		pricingCheckoutDialogMock.mockClear();
		resetPersonaStore();
		global.fetch = mockFetch as unknown as typeof fetch;
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
		const scrollIntoView = vi.fn();
		const getElementByIdSpy = vi
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

	it("requests Stripe trial intent and opens checkout when the primary CTA is clicked", async () => {
		const mockResponse = {
			ok: true,
			json: async () => ({ clientSecret: "secret_123" }),
		} as Response;
		mockFetch.mockResolvedValue(mockResponse);

		render(<DynamicHeroDemoPage />);

		const primaryButton = screen.getByTestId("primary-cta");
		fireEvent.click(primaryButton);

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalled();
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"/api/stripe/trial",
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}),
		);

		const [, requestInit] = mockFetch.mock.calls[0];
		const payload = JSON.parse(
			(requestInit as RequestInit).body as string,
		) as Record<string, unknown>;

		expect(payload).toMatchObject({
			planId: expect.stringContaining("dynamic-hero"),
			planName: expect.any(String),
		});

		await waitFor(() =>
			expect(toast.success).toHaveBeenCalledWith(
				expect.stringMatching(/trial checkout is ready/i),
			),
		);
		await waitFor(() =>
			expect(screen.getByTestId("pricing-checkout-dialog")).toHaveTextContent(
				"secret_123",
			),
		);
		expect(pricingCheckoutDialogMock).toHaveBeenCalledWith(
			expect.objectContaining({ clientSecret: "secret_123" }),
		);
	});

	it("scrolls to the video preview and triggers playback when the secondary CTA is clicked", async () => {
		render(<DynamicHeroDemoPage />);

		fireEvent.click(
			screen.getByRole("button", { name: /preview guided demo/i }),
		);

		expect(scrollIntoViewMock).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "center",
		});
		await waitFor(() =>
			expect(heroModuleMocks.playVideo).toHaveBeenCalledTimes(1),
		);
	});

	it("syncs the persona store with the Quick Start persona and goal", async () => {
		render(<DynamicHeroDemoPage />);

		await waitFor(() =>
			expect(usePersonaStore.getState().persona).toBe(QUICK_START_PERSONA_KEY),
		);
		expect(usePersonaStore.getState().goal).toBe(QUICK_START_PERSONA_GOAL);
	});
});
