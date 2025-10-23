import React from "react";
import { render, screen } from "@testing-library/react";

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

jest.mock("@/hooks/useDataModuleGuardTelemetry", () => ({
        useDataModuleGuardTelemetry: jest.fn(),
}));

jest.mock("@/hooks/use-category-filter", () => ({
        useCategoryFilter: () => ({
                activeCategory: "all",
                setActiveCategory: jest.fn(),
                CategoryFilter: () => <div data-testid="category-filter" />, // eslint-disable-line react/display-name
        }),
}));

describe("CaseStudyGrid guard fallbacks", () => {
        beforeEach(() => {
                jest.clearAllMocks();
                useDataModuleMock.mockReset();
        });

        it("renders a loading placeholder while the module is idle", async () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: any) => any) => {
                        if (key === "caseStudy/caseStudies") {
                                return selector({ status: "idle", data: undefined, error: undefined });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: CaseStudyGrid } = require("../CaseStudyGrid");

                render(<CaseStudyGrid caseStudies={[]} />);

                expect(
                        screen.getByText(/Loading case studies/i),
                ).toBeInTheDocument();
        });

        it("renders an error placeholder when the module fails", async () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: any) => any) => {
                        if (key === "caseStudy/caseStudies") {
                                return selector({
                                        status: "error",
                                        data: undefined,
                                        error: new Error("boom"),
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: CaseStudyGrid } = require("../CaseStudyGrid");

                render(<CaseStudyGrid caseStudies={[]} />);

                expect(
                        screen.getByText(/Unable to load case studies right now/i),
                ).toBeInTheDocument();
        });

        it("shows a coming-soon placeholder when no case studies are available", async () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: any) => any) => {
                        if (key === "caseStudy/caseStudies") {
                                return selector({
                                        status: "ready",
                                        data: { caseStudyCategories: [], caseStudies: [] },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: CaseStudyGrid } = require("../CaseStudyGrid");

                render(<CaseStudyGrid caseStudies={[]} />);

                expect(
                        screen.getByText(/Case studies coming soon/i),
                ).toBeInTheDocument();
        });
});
