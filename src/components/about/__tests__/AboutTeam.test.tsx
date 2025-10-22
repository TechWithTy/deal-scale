import React from "react";
import { render, screen } from "@testing-library/react";

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

describe("AboutTeam", () => {
        beforeEach(() => {
                useDataModuleMock.mockReset();
        });

        it("renders the loading fallback while the data module is idle", () => {
                useDataModuleMock.mockImplementation(
                        (_key: string, selector: (state: unknown) => unknown) =>
                                selector({ status: "idle", data: undefined, error: undefined }),
                );

                const { default: AboutTeam } = require("../AboutTeam");

                render(<AboutTeam />);

                expect(screen.getByText(/Loading team/i)).toBeInTheDocument();
        });
});
