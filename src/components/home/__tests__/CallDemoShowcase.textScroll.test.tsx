import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { act } from "react";
import { usePersonaStore } from "../../../stores/usePersonaStore";

const pixelatedMocks = vi.hoisted(() => ({
	mockComponent: vi.fn(() => <div data-testid="pixelated-card" />),
}));

vi.mock("next/dynamic", () => ({
	__esModule: true,
	default: () => React.memo(pixelatedMocks.mockComponent),
}));

vi.mock("../../ui/pixelated-voice-clone-card", () => ({
	__esModule: true,
	PixelatedVoiceCloneCard: React.memo(pixelatedMocks.mockComponent),
}));

vi.mock("../../deal_scale/talkingCards/SessionMonitor", () => ({
	__esModule: true,
	default: () => <div data-testid="session-monitor" />,
}));

vi.mock("../../ui/typing-animation", () => ({
	__esModule: true,
	TypingAnimation: () => <div data-testid="typing-animation" />,
}));

vi.mock("../../ui/animatedList", () => ({
	__esModule: true,
	AnimatedList: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animated-list">{children}</div>
	),
}));

vi.mock("../../ui/iphone", () => ({
	__esModule: true,
	Iphone: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="iphone">{children}</div>
	),
}));

vi.mock("../../ui/layout-grid", () => ({
	__esModule: true,
	LayoutGrid: ({
		cards,
	}: {
		cards: Array<{ id: number | string; content: React.ReactNode }>;
	}) => (
		<div data-testid="layout-grid">
			{cards.map((card) => (
				<div key={card.id}>{card.content}</div>
			))}
		</div>
	),
}));

let CallDemoShowcaseModule: typeof import("../CallDemoShowcase");

beforeAll(async () => {
	CallDemoShowcaseModule = await import("../CallDemoShowcase");

	class MockIntersectionObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	}

	// @ts-ignore
	global.IntersectionObserver = MockIntersectionObserver;
});

describe("CallDemoShowcase text scroll behavior", () => {
	let mockScrollTo: ReturnType<typeof vi.fn>;
	let windowScrollToSpy: ReturnType<typeof vi.spyOn>;

	const renderShowcase = async () => {
		let utils: ReturnType<typeof render> | undefined;
		await act(async () => {
			utils = render(<CallDemoShowcaseModule.CallDemoShowcase />);
		});
		if (!utils) {
			throw new Error("Failed to render CallDemoShowcase");
		}
		return utils;
	};

	beforeEach(() => {
		vi.useFakeTimers();

		usePersonaStore
			.getState()
			.setPersonaAndGoal("investor", "Automate deal flow conversations");

		mockScrollTo = vi.fn();
		windowScrollToSpy = vi
			.spyOn(window, "scrollTo")
			.mockImplementation(() => {});
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.clearAllTimers();
		vi.useRealTimers();
		pixelatedMocks.mockComponent.mockReset();
		windowScrollToSpy.mockRestore();
	});

	const setupScrollContainer = (
		scrollContainer: HTMLDivElement,
		options?: { containerTop?: number; shouldReturnMessage?: boolean },
	) => {
		const { containerTop = 100, shouldReturnMessage = true } = options ?? {};

		Object.defineProperty(scrollContainer, "clientHeight", {
			writable: true,
			value: 420,
		});
		Object.defineProperty(scrollContainer, "scrollTop", {
			writable: true,
			value: 0,
		});
		Object.defineProperty(scrollContainer, "scrollHeight", {
			writable: true,
			value: 1200,
		});
		Object.defineProperty(scrollContainer, "scrollTo", {
			writable: true,
			value: mockScrollTo,
		});
		Object.defineProperty(scrollContainer, "getBoundingClientRect", {
			writable: true,
			value: () => ({
				top: containerTop,
				left: 0,
				right: 360,
				bottom: containerTop + 420,
				width: 360,
				height: 420,
				x: 0,
				y: containerTop,
				toJSON: vi.fn(),
			}),
		});

		const querySpy = vi.spyOn(scrollContainer, "querySelector");

		if (shouldReturnMessage) {
			const mockMessage = {
				getBoundingClientRect: vi.fn(() => ({
					top: containerTop + 480,
					left: 0,
					right: 360,
					bottom: containerTop + 540,
					width: 360,
					height: 60,
					x: 0,
					y: containerTop + 480,
					toJSON: vi.fn(),
				})),
				scrollIntoView: vi.fn(),
				offsetHeight: 60,
			} as unknown as HTMLElement;

			querySpy.mockReturnValue(mockMessage);
		}

		return { querySpy };
	};

	it("scrolls container without triggering page scroll", async () => {
		const utils = await renderShowcase();

		await act(async () => {
			vi.advanceTimersByTime(0);
		});

		const scrollContainer = utils.getByTestId(
			"text-demo-scroll-container",
		) as HTMLDivElement;

		setupScrollContainer(scrollContainer);

		await act(async () => {
			vi.advanceTimersByTime(3200);
		});

		await act(async () => {
			vi.runOnlyPendingTimers();
		});

		expect(mockScrollTo).toHaveBeenCalled();
		expect(windowScrollToSpy).not.toHaveBeenCalled();
	});

	it("does not call scrollIntoView on message elements", async () => {
		const mockScrollIntoView = vi.fn();

		const utils = await renderShowcase();

		await act(async () => {
			vi.advanceTimersByTime(0);
		});

		const scrollContainer = utils.getByTestId(
			"text-demo-scroll-container",
		) as HTMLDivElement;

		const { querySpy } = setupScrollContainer(scrollContainer);

		const mockMessage = {
			getBoundingClientRect: vi.fn(() => ({
				top: 580,
				left: 0,
				right: 360,
				bottom: 640,
				width: 360,
				height: 60,
				x: 0,
				y: 580,
				toJSON: vi.fn(),
			})),
			scrollIntoView: mockScrollIntoView,
			offsetHeight: 60,
		} as unknown as HTMLElement;

		querySpy.mockReturnValue(mockMessage);

		await act(async () => {
			vi.advanceTimersByTime(3200);
		});

		await act(async () => {
			vi.runOnlyPendingTimers();
		});

		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});

	it("skips auto-scroll when container is off-screen", async () => {
		const utils = await renderShowcase();

		await act(async () => {
			vi.advanceTimersByTime(0);
		});

		const scrollContainer = utils.getByTestId(
			"text-demo-scroll-container",
		) as HTMLDivElement;

		setupScrollContainer(scrollContainer, {
			containerTop: window.innerHeight + 200,
		});

		await act(async () => {
			vi.advanceTimersByTime(3200);
		});

		await act(async () => {
			vi.runOnlyPendingTimers();
		});

		expect(mockScrollTo).not.toHaveBeenCalled();
	});
});

