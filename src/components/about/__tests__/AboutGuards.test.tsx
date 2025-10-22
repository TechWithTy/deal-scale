import React from "react";
import { render, screen } from "@testing-library/react";

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

jest.mock("@/components/common/Header", () => ({
        __esModule: true,
        default: ({ title }: { title: string }) => <div data-testid="header">{title}</div>,
}));

jest.mock("@/components/magicui/aurora-text", () => ({
        __esModule: true,
        AuroraText: ({ children }: { children: React.ReactNode }) => (
                <div data-testid="aurora-text">{children}</div>
        ),
}));

jest.mock("@/components/magicui/blur-fade", () => ({
        __esModule: true,
        BlurFade: ({ children }: { children: React.ReactNode }) => (
                <div data-testid="blur-fade">{children}</div>
        ),
}));

jest.mock("@/components/ui/timeline", () => ({
        __esModule: true,
        Timeline: ({ data }: { data: unknown[] }) => (
                <div data-testid="timeline" data-count={Array.isArray(data) ? data.length : 0} />
        ),
}));

describe("About components data module guards", () => {
        beforeEach(() => {
                useDataModuleMock.mockReset();
        });

        it("renders the loading fallback while AboutHero data is idle", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "about/hero") {
                                return selector({ status: "idle", data: undefined, error: undefined });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: AboutHero } = require("../AboutHero");

                render(<AboutHero />);

                expect(screen.getByText(/Loading story/i)).toBeInTheDocument();
        });

        it("renders the loading fallback while AboutTimeline data is idle", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "about/timeline") {
                                return selector({ status: "idle", data: undefined, error: undefined });
                        }

                        return selector({ status: "ready", data: { timeline: [] }, error: undefined });
                });

                const { default: AboutTimeline } = require("../AboutTimeline");

                render(<AboutTimeline />);

                expect(screen.getByText(/Loading timeline/i)).toBeInTheDocument();
                expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
        });

        it("shows a friendly placeholder when the timeline module resolves empty", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "about/timeline") {
                                return selector({ status: "ready", data: { timeline: [] }, error: undefined });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: AboutTimeline } = require("../AboutTimeline");

                render(<AboutTimeline />);

                expect(
                        screen.getByText(/timeline coming soon/i),
                ).toBeInTheDocument();
        });
});
