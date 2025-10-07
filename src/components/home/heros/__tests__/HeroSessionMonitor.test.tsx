import { render, screen } from "@testing-library/react";
import React from "react";

import HeroSessionMonitor from "../HeroSessionMonitor";

jest.mock("next/dynamic", () => {
        const React = require("react") as typeof import("react");
        return {
                __esModule: true,
                default: (
                        _importer: () => Promise<unknown>,
                        options?: { loading?: React.ComponentType },
                ) => {
                        const Loading = options?.loading;
                        const DynamicComponent = (
                                props: Record<string, unknown>,
                        ) => (Loading ? React.createElement(Loading, props) : null);
                        DynamicComponent.displayName = "DynamicComponentMock";
                        return DynamicComponent;
                },
        };
});

jest.mock("framer-motion", () => {
        const React = require("react") as typeof import("react");
        const createMock = (tag: keyof JSX.IntrinsicElements) =>
                ({ children, ...props }: { children?: React.ReactNode }) =>
                        React.createElement(tag, props, children);

        return {
                motion: {
                        span: createMock("span"),
                        div: createMock("div"),
                },
        };
});

describe("HeroSessionMonitor", () => {
        it("renders badge and CTA buttons without runtime errors", () => {
                render(
                        <HeroSessionMonitor
                                headline="Test headline"
                                subheadline="Discover real-time insights with analytics"
                                badge="Beta access"
                                ctaLabel="Primary CTA"
                                ctaLabel2="Secondary CTA"
                                onCtaClick={() => undefined}
                                onCtaClick2={() => undefined}
                        />,
                );

                expect(screen.getByText("Beta access")).toBeInTheDocument();
                expect(screen.getByText("Primary CTA")).toBeInTheDocument();
                expect(screen.getByText("Secondary CTA")).toBeInTheDocument();
        });
});
