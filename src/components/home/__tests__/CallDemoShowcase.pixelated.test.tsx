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
	LayoutGrid: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="layout-grid">{children}</div>
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

describe("CallDemoShowcase pixelated clone integration", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.clearAllTimers();
		vi.useRealTimers();
		pixelatedMocks.mockComponent.mockReset();
	});

	it("does not remount pixelated card during text auto-advance", async () => {
		const { CallDemoShowcase } = CallDemoShowcaseModule;

		await act(async () => {
			render(<CallDemoShowcase />);
		});

		await act(async () => {
			vi.advanceTimersByTime(0);
		});
		const initialCalls = pixelatedMocks.mockComponent.mock.calls.length;

		act(() => {
			vi.advanceTimersByTime(3200);
		});

		expect(pixelatedMocks.mockComponent.mock.calls.length).toBe(initialCalls);
	});
});
