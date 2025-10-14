import { render, screen, waitFor } from "@testing-library/react";
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

        it("renders responsive container spacing classes", () => {
                const { HeroOffering } = require("@/components/home/HeroOffering");
                const { container } = render(<HeroOffering />);

                const root = container.firstChild as HTMLElement;

                expect(root).toHaveClass("px-4");
                expect(root).toHaveClass("py-6");
                expect(root).toHaveClass("sm:min-h-[400px]");
                expect(root).toHaveClass("md:min-h-[460px]");
                expect(root).toHaveClass("lg:min-h-[520px]");
                expect(root).toHaveClass("self-center");
                expect(root).toHaveClass("w-fit");
                expect(root).toHaveClass("md:max-w-none");
                expect(root).toHaveClass("md:w-full");
                expect(root).toHaveClass("max-w-[18rem]");
                expect(root).toHaveClass("sm:max-w-3xl");
        });

        it("renders fallback spline model when no image is provided", () => {
                const { HeroOffering } = require("@/components/home/HeroOffering");
                render(<HeroOffering />);

                expect(screen.getByTestId("spline-model-mock")).toBeInTheDocument();
        });

        it("logs container metrics for debugging", async () => {
                const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => undefined);

                const { HeroOffering } = require("@/components/home/HeroOffering");
                render(<HeroOffering />);

                await waitFor(() => {
                        expect(debugSpy).toHaveBeenCalledWith(
                                "[HeroOffering] layout metrics",
                                expect.objectContaining({
                                        container: expect.objectContaining({
                                                className: expect.stringContaining("max-w-[18rem]"),
                                                computed: expect.objectContaining({
                                                        display: expect.any(String),
                                                }),
                                        }),
                                        parentChain: expect.arrayContaining([
                                                expect.objectContaining({
                                                        nodeName: expect.any(String),
                                                }),
                                        ]),
                                        timestamp: expect.any(String),
                                        viewportWidth: expect.any(Number),
                                }),
                        );
                });

                debugSpy.mockRestore();
        });
});
