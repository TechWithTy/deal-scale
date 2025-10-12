import { render } from "@testing-library/react";
import type React from "react";

jest.mock("@/components/ui/SafeMotionDiv", () => ({
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => (
                <div data-testid="safe-motion-mock">{children}</div>
        ),
}));

jest.mock("@/components/ui/spline-model", () => ({
        __esModule: true,
        default: () => <div data-testid="spline-model-mock">Spline</div>,
}));

jest.mock("@/hooks/use-mobile", () => ({
        useIsMobile: jest.fn(),
}));

jest.mock("next/image", () => ({
        __esModule: true,
        default: (props: React.ComponentPropsWithoutRef<"img">) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={props.alt} {...props} />
        ),
}));

describe("HeroOffering", () => {
        beforeEach(() => {
                jest.clearAllMocks();
        });

        it("applies mobile padding when rendered on mobile", () => {
                const { useIsMobile } = require("@/hooks/use-mobile");
                (useIsMobile as jest.Mock).mockReturnValue(true);

                const { HeroOffering } = require("@/components/home/HeroOffering");
                const { container } = render(<HeroOffering />);

                const root = container.firstChild as HTMLElement;

                expect(root).toHaveClass("py-6");
                expect(root).not.toHaveClass("min-h-[340px]");
        });

        it("applies desktop min-height when rendered on larger screens", () => {
                const { useIsMobile } = require("@/hooks/use-mobile");
                (useIsMobile as jest.Mock).mockReturnValue(false);

                const { HeroOffering } = require("@/components/home/HeroOffering");
                const { container } = render(<HeroOffering />);

                const root = container.firstChild as HTMLElement;

                expect(root).toHaveClass("min-h-[340px]");
                expect(root).not.toHaveClass("py-6");
        });
});
