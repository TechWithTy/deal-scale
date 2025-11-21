import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useDataModuleMock = vi.fn();

vi.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

const loadAboutTeam = async () => (await import("../AboutTeam")).default;

describe("AboutTeam", () => {
	beforeEach(() => {
		useDataModuleMock.mockReset();
	});

	it("renders the loading fallback while the data module is idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
				if (key === "about/team") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		const AboutTeam = await loadAboutTeam();

		render(<AboutTeam />);

		expect(screen.getByText(/Loading team/i)).toBeInTheDocument();
	});
});
