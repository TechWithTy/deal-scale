import React from "react";
import { render } from "@testing-library/react";

import type { DataModuleStatus } from "@/stores/useDataModuleStore";
jest.mock("@/utils/observability/dataModuleGuards", () => ({
        reportDataModuleGuard: jest.fn(),
}));

import { useDataModuleGuardTelemetry } from "../useDataModuleGuardTelemetry";
import { reportDataModuleGuard } from "@/utils/observability/dataModuleGuards";

describe("useDataModuleGuardTelemetry", () => {
        beforeEach(() => {
                jest.clearAllMocks();
        });

        function TestHarness({
                status,
                hasData,
                error,
        }: {
                status: DataModuleStatus;
                hasData: boolean;
                error?: unknown;
        }) {
                useDataModuleGuardTelemetry({
                        key: "caseStudy/caseStudies",
                        surface: "TestSurface",
                        status,
                        hasData,
                        error,
                });

                return null;
        }

        it("reports when the module stays idle", () => {
                render(<TestHarness status="idle" hasData={false} />);

                expect(reportDataModuleGuard).toHaveBeenCalledWith(
                        expect.objectContaining({
                                key: "caseStudy/caseStudies",
                                status: "idle",
                                surface: "TestSurface",
                                hasData: false,
                        }),
                );
        });

        it("reports when the module enters an error state", () => {
                const { rerender } = render(<TestHarness status="loading" hasData={false} />);

                jest.clearAllMocks();

                rerender(
                        <TestHarness
                                status="error"
                                hasData={false}
                                error={new Error("load failed")}
                        />,
                );

                expect(reportDataModuleGuard).toHaveBeenCalledWith(
                        expect.objectContaining({
                                status: "error",
                                error: "load failed",
                        }),
                );
        });

        it("does not re-emit identical loading states", () => {
                const { rerender } = render(<TestHarness status="loading" hasData={false} />);

                expect(reportDataModuleGuard).toHaveBeenCalledTimes(1);

                jest.clearAllMocks();

                rerender(<TestHarness status="loading" hasData={false} />);

                expect(reportDataModuleGuard).not.toHaveBeenCalled();
        });

        it("reports empty ready payloads once", () => {
                const { rerender } = render(<TestHarness status="ready" hasData={false} />);

                expect(reportDataModuleGuard).toHaveBeenCalledWith(
                        expect.objectContaining({ status: "ready", hasData: false }),
                );

                jest.clearAllMocks();

                rerender(<TestHarness status="ready" hasData={true} />);

                expect(reportDataModuleGuard).not.toHaveBeenCalled();
        });
});
