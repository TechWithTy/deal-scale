import React from "react";
import { render, screen } from "@testing-library/react";

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

jest.mock("framer-motion", () => ({
        motion: {
                div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
                        <div {...rest}>{children}</div>
                ),
        },
}));

jest.mock("next/link", () => ({
        __esModule: true,
        default: ({ href, children }: { href: string; children: React.ReactNode }) => (
                <a href={href}>{children}</a>
        ),
}));

describe("Contact components data module guards", () => {
        beforeEach(() => {
                jest.resetModules();
                useDataModuleMock.mockReset();
        });

        it("renders a loading state for ContactHero while company data is idle", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "company") {
                                return selector({ status: "idle", data: undefined, error: undefined });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { ContactHero } = require("../form/ContactHero");

                render(<ContactHero />);

                expect(screen.getByText(/Loading contact information/i)).toBeInTheDocument();
        });

        it("renders a loading state for ContactInfo while company data is idle", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: unknown) => unknown) => {
                        if (key === "company") {
                                return selector({ status: "idle", data: undefined, error: undefined });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const { ContactInfo } = require("../form/ContactInfo");

                render(<ContactInfo />);

                expect(screen.getByText(/Loading contact details/i)).toBeInTheDocument();
        });
});
