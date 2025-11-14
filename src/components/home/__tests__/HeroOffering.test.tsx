import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import type React from "react";

vi.mock("@/components/ui/SafeMotionDiv", () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="safe-motion-mock">{children}</div>
	),
}));

vi.mock("@/components/ui/spline-model", () => ({
	__esModule: true,
	default: () => <div data-testid="spline-model-mock">Spline</div>,
}));

const useIsMobileMock = vi.fn();

vi.mock("@/hooks/use-mobile", () => ({
	useIsMobile: useIsMobileMock,
}));

vi.mock("next/image", () => ({
	__esModule: true,
	default: (props: React.ComponentPropsWithoutRef<"img">) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={props.alt ?? ""} {...props} />
	),
}));

let HeroOffering: typeof import("@/components/home/HeroOffering").HeroOffering;

beforeEach(async () => {
	vi.clearAllMocks();
	({ HeroOffering } = await import("@/components/home/HeroOffering"));
});

describe("HeroOffering", () => {
	it("applies mobile padding when rendered on mobile", () => {
		useIsMobileMock.mockReturnValue(true);

		const { container } = render(<HeroOffering />);

		const root = container.firstChild as HTMLElement;

		expect(root).toHaveClass("py-6");
		expect(root).not.toHaveClass("min-h-[340px]");
	});

	it("applies desktop min-height when rendered on larger screens", () => {
		useIsMobileMock.mockReturnValue(false);

		const { container } = render(<HeroOffering />);

		const root = container.firstChild as HTMLElement;

		expect(root).toHaveClass("min-h-[340px]");
		expect(root).not.toHaveClass("py-6");
	});
});
