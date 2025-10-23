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

jest.mock("@/components/case-studies/CaseStudyBusinessOutcome", () => ({
        __esModule: true,
        CaseStudyBusinessOutcome: () => <div data-testid="business-outcome" />, // eslint-disable-line react/display-name
}));

jest.mock("@/components/case-studies/CaseStudyContent", () => ({
        __esModule: true,
        default: () => <div data-testid="case-study-content" />, // eslint-disable-line react/display-name
}));

jest.mock("@/components/case-studies/CaseStudyDetailHeader", () => ({
        __esModule: true,
        default: () => <div data-testid="case-study-header" />, // eslint-disable-line react/display-name
}));

jest.mock("@/components/case-studies/RelatedCaseStudies", () => ({
        __esModule: true,
        default: () => <div data-testid="related-case-studies" />, // eslint-disable-line react/display-name
}));

jest.mock("@/components/home/Testimonials", () => ({
        __esModule: true,
        default: ({ testimonials }: { testimonials: unknown[] }) => (
                <div data-testid="testimonials" data-count={testimonials.length} />
        ),
}));

jest.mock("@/components/bento/page", () => ({
        __esModule: true,
        default: ({ features }: { features: unknown[] }) => (
                <div data-testid="bento" data-count={features.length} />
        ),
}));

jest.mock("@/components/services/HowItWorksCarousel", () => ({
        __esModule: true,
        default: () => <div data-testid="how-it-works" />, // eslint-disable-line react/display-name
}));

jest.mock("@/components/common/CTASection", () => ({
        __esModule: true,
        CTASection: ({ title }: { title: string }) => (
                <div data-testid="cta" data-title={title} />
        ),
}));

jest.mock("@/components/common/SEOWrapper", () => ({
        __esModule: true,
        SEOWrapper: () => <></>,
        default: () => <></>,
}));

jest.mock("@/components/ui/section-heading", () => ({
        __esModule: true,
        SectionHeading: ({ title }: { title: string }) => (
                <div data-testid="section-heading" data-title={title} />
        ),
}));

jest.mock("@/components/ui/separator", () => ({
        __esModule: true,
        Separator: () => <hr data-testid="separator" />, // eslint-disable-line react/display-name
}));

jest.mock("@/components/home/heros/HeroSessionMonitor", () => ({
        __esModule: true,
        default: () => <div data-testid="hero-session-monitor" />, // eslint-disable-line react/display-name
}));

const baseCaseStudy = {
        id: "cs",
        title: "Case Study",
        slug: "case-study",
        categories: ["all"],
        subtitle: "Subtitle",
        summary: "Summary",
        heroImage: "/hero.jpg",
        howItWorks: [],
        results: [],
        metrics: [],
        highlights: [],
        techStacks: [],
        businessOutcomes: [],
        servicesUsed: [],
        testimonial: null,
        timeline: [],
        location: "",
        industry: "",
        companySize: "",
        challenge: "",
        solution: "",
        impact: "",
        lastModified: new Date("2024-01-01T00:00:00.000Z"),
        overview: {
                company: "",
                industry: "",
                location: "",
                size: "",
        },
        copyright: {
                title: "CTA Title",
                subtitle: "CTA subtitle",
                ctaText: "Contact",
                ctaLink: "/contact",
        },
};

describe("CaseStudyPageClient guard fallbacks", () => {
        beforeEach(() => {
                jest.clearAllMocks();
                useDataModuleMock.mockReset();
        });

        it("shows a loading placeholder while the bento features module resolves", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: any) => any) => {
                        if (key === "bento/main") {
                                return selector({ status: "loading", data: undefined, error: undefined });
                        }

                        if (key === "service/slug_data/testimonials") {
                                return selector({
                                        status: "ready",
                                        data: { generalDealScaleTestimonials: [] },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const CaseStudyPageClient = require("../[slug]/CaseStudyPageClient").default;

                render(
                        <CaseStudyPageClient
                                caseStudy={baseCaseStudy as any}
                                relatedCaseStudies={[]}
                        />,
                );

                expect(screen.getByText(/Loading highlights/i)).toBeInTheDocument();
        });

        it("shows an error placeholder when testimonials fail to load", () => {
                const error = new Error("network error");
                useDataModuleMock.mockImplementation((key: string, selector: (state: any) => any) => {
                        if (key === "bento/main") {
                                return selector({
                                        status: "ready",
                                        data: { MainBentoFeatures: [] },
                                        error: undefined,
                                });
                        }

                        if (key === "service/slug_data/testimonials") {
                                return selector({ status: "error", data: undefined, error });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const CaseStudyPageClient = require("../[slug]/CaseStudyPageClient").default;

                render(
                        <CaseStudyPageClient
                                caseStudy={baseCaseStudy as any}
                                relatedCaseStudies={[]}
                        />,
                );

                expect(
                        screen.getByText(/Unable to load testimonials right now/i),
                ).toBeInTheDocument();
        });

        it("shows a placeholder when testimonials resolve empty", () => {
                useDataModuleMock.mockImplementation((key: string, selector: (state: any) => any) => {
                        if (key === "bento/main") {
                                return selector({
                                        status: "ready",
                                        data: { MainBentoFeatures: [] },
                                        error: undefined,
                                });
                        }

                        if (key === "service/slug_data/testimonials") {
                                return selector({
                                        status: "ready",
                                        data: { generalDealScaleTestimonials: [] },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                const CaseStudyPageClient = require("../[slug]/CaseStudyPageClient").default;

                render(
                        <CaseStudyPageClient
                                caseStudy={baseCaseStudy as any}
                                relatedCaseStudies={[]}
                        />,
                );

                expect(screen.getByText(/Testimonials coming soon/i)).toBeInTheDocument();
        });
});
