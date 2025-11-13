import { render } from "@testing-library/react";
import React from "react";
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import type { DataModuleStatus } from "@/stores/useDataModuleStore";

const observabilityMocks = vi.hoisted(() => ({
	reportDataModuleGuard: vi.fn(),
}));

vi.mock("@/utils/observability/dataModuleGuards", () => observabilityMocks);

import { reportDataModuleGuard } from "@/utils/observability/dataModuleGuards";
import { useDataModuleGuardTelemetry } from "../useDataModuleGuardTelemetry";

describe("useDataModuleGuardTelemetry", () => {
	beforeEach(() => {
		vi.clearAllMocks();
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
		const { rerender } = render(
			<TestHarness status="loading" hasData={false} />,
		);

		vi.clearAllMocks();

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
		const { rerender } = render(
			<TestHarness status="loading" hasData={false} />,
		);

		expect(reportDataModuleGuard).toHaveBeenCalledTimes(1);

		vi.clearAllMocks();

		rerender(<TestHarness status="loading" hasData={false} />);

		expect(reportDataModuleGuard).not.toHaveBeenCalled();
	});

	it("reports empty ready payloads once", () => {
		const { rerender } = render(<TestHarness status="ready" hasData={false} />);

		expect(reportDataModuleGuard).toHaveBeenCalledWith(
			expect.objectContaining({ status: "ready", hasData: false }),
		);

		vi.clearAllMocks();

		rerender(<TestHarness status="ready" hasData={true} />);

		expect(reportDataModuleGuard).not.toHaveBeenCalled();
	});
});
