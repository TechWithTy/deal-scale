import React from "react";
import { render, screen } from "@testing-library/react";

const useDataModuleMock = jest.fn();
const TrustedByScrollerMock = jest.fn(() => <div data-testid="trusted-scroller" />);

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

jest.mock("@/components/contact/utils/TrustedByScroller", () => ({
        __esModule: true,
        default: (...args: unknown[]) => TrustedByScrollerMock(...args),
}));

jest.mock("@/components/common/Header", () => ({
        __esModule: true,
        default: ({ title }: { title: string }) => <div data-testid="header">{title}</div>,
}));

describe("TrustedBySection", () => {
        beforeEach(() => {
                jest.resetModules();
                useDataModuleMock.mockReset();
                TrustedByScrollerMock.mockClear();
        });

        it("renders a loading fallback while company logos are idle", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "service/slug_data/trustedCompanies") {
                                return selector({ status: "idle", data: undefined, error: undefined });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: TrustedBySection } = require("../product/TrustedBySection");

                render(<TrustedBySection />);

                expect(screen.getByText(/Loading trusted partners/i)).toBeInTheDocument();
                expect(TrustedByScrollerMock).not.toHaveBeenCalled();
        });

        it("passes hydrated logos to the scroller once ready", () => {
                const companyLogos = {
                        dealscale: { logo: "/logo.svg", description: "DealScale" },
                };
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "service/slug_data/trustedCompanies") {
                                return selector({
                                        status: "ready",
                                        data: { companyLogos },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: TrustedBySection } = require("../product/TrustedBySection");

                render(<TrustedBySection />);

                expect(TrustedByScrollerMock).toHaveBeenCalledWith(
                        expect.objectContaining({ items: companyLogos, variant: "secondary" }),
                        expect.anything(),
                );
        });

        it("shows an empty-ready placeholder when no logos are available", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "service/slug_data/trustedCompanies") {
                                return selector({
                                        status: "ready",
                                        data: { companyLogos: {} },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { default: TrustedBySection } = require("../product/TrustedBySection");

                render(<TrustedBySection />);

                expect(screen.getByText(/Trusted partners coming soon/i)).toBeInTheDocument();
                expect(TrustedByScrollerMock).not.toHaveBeenCalled();
        });
});
