import React from "react";
import { render, screen } from "@testing-library/react";

type DataModuleSelector<T> = (value: any) => T;

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

jest.mock("@/components/home/Testimonials", () => ({
        __esModule: true,
        default: jest.fn(() => <div data-testid="testimonials-component" />),
}));

jest.mock("@/components/contact/utils/TrustedByScroller", () => ({
        __esModule: true,
        default: jest.fn(() => <div data-testid="trusted-by" />),
}));

jest.mock("@/components/home/heros/Hero", () => ({
        __esModule: true,
        default: jest.fn(() => <div data-testid="hero" />),
}));

jest.mock("@/components/contact/newsletter/NewsletterEmailInput", () => ({
        __esModule: true,
        NewsletterEmailInput: () => <div data-testid="newsletter-input" />,
}));

jest.mock("@/components/home/BlogPreview", () => ({
        __esModule: true,
        BlogPreview: () => <div data-testid="blog-preview" />,
}));

jest.mock("@/components/home/ClientBento", () => ({
        __esModule: true,
        default: () => <div data-testid="client-bento" />,
}));

jest.mock("@/components/ui/separator", () => ({
        __esModule: true,
        Separator: () => <div data-testid="separator" />,
}));

describe("NewsletterClient", () => {
        beforeEach(() => {
                useDataModuleMock.mockReset();
        });

        it("renders a loading fallback while testimonials are idle", () => {
                useDataModuleMock.mockImplementation(
                        (key: string, selector: DataModuleSelector<unknown>) => {
                                if (key === "service/slug_data/testimonials") {
                                        return selector({
                                                status: "idle",
                                                data: undefined,
                                                error: undefined,
                                        });
                                }

                                return selector({
                                        status: "ready",
                                        data: { companyLogos: {} },
                                        error: undefined,
                                });
                        },
                );

                const { default: NewsletterClient } = require("../NewsletterClient");

                render(<NewsletterClient posts={[]} />);

                expect(screen.getByText(/Loading testimonials/i)).toBeInTheDocument();
                expect(screen.queryByTestId("testimonials-component")).not.toBeInTheDocument();
        });

        it("shows a friendly message when testimonials are ready but empty", () => {
                useDataModuleMock.mockImplementation(
                        (key: string, selector: DataModuleSelector<unknown>) => {
                                if (key === "service/slug_data/testimonials") {
                                        return selector({
                                                status: "ready",
                                                data: { generalDealScaleTestimonials: [] },
                                                error: undefined,
                                        });
                                }

                                return selector({
                                        status: "ready",
                                        data: { companyLogos: {} },
                                        error: undefined,
                                });
                        },
                );

                const { default: NewsletterClient } = require("../NewsletterClient");

                render(<NewsletterClient posts={[]} />);

                expect(
                        screen.getByText(/Testimonials coming soon/i),
                ).toBeInTheDocument();
                expect(screen.queryByTestId("testimonials-component")).not.toBeInTheDocument();
        });
});
