import { render } from "@testing-library/react";
import type React from "react";
import { act } from "react";

jest.mock("next/dynamic", () => {
	return (importer: () => Promise<any>) => {
		return require("@/components/ui/pixelated-voice-clone-card")
			.PixelatedVoiceCloneCard;
	};
});

jest.mock("@/components/ui/pixelated-voice-clone-card", () => {
	const React = require("react");
	const mockComponent = jest.fn(() => <div data-testid="pixelated-card" />);
	return {
		__esModule: true,
		PixelatedVoiceCloneCard: React.memo(mockComponent),
		__mock: { mockComponent },
	};
});

jest.mock("@/components/deal_scale/talkingCards/SessionMonitor", () => ({
	__esModule: true,
	default: () => <div data-testid="session-monitor" />,
}));

jest.mock("@/components/ui/typing-animation", () => ({
	__esModule: true,
	TypingAnimation: () => <div data-testid="typing-animation" />,
}));

jest.mock("@/components/ui/animatedList", () => ({
	__esModule: true,
	AnimatedList: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animated-list">{children}</div>
	),
}));

jest.mock("@/components/ui/iphone", () => ({
	__esModule: true,
	Iphone: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="iphone">{children}</div>
	),
}));

jest.mock("@/components/ui/layout-grid", () => ({
	__esModule: true,
	LayoutGrid: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="layout-grid">{children}</div>
	),
}));

describe("CallDemoShowcase pixelated clone integration", () => {
	beforeAll(() => {
		class MockIntersectionObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		}
		// @ts-ignore
		global.IntersectionObserver = MockIntersectionObserver;
	});

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it("does not remount pixelated card during text auto-advance", () => {
		const {
			__mock: { mockComponent: mockPixelated },
		} = jest.requireMock("@/components/ui/pixelated-voice-clone-card");
		const { PixelatedVoiceCloneCard } = jest.requireMock(
			"@/components/ui/pixelated-voice-clone-card",
		);
		const { CallDemoShowcase } = require("../CallDemoShowcase");

		render(<CallDemoShowcase />);
		const initialCalls = mockPixelated.mock.calls.length;

		act(() => {
			jest.advanceTimersByTime(3200);
		});

		expect(mockPixelated.mock.calls.length).toBe(initialCalls);
	});
});
