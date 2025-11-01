import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/data/bento/main", () => ({
        MainBentoFeatures: [],
}));

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
        __esModule: true,
        useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
        createDataModuleStore: jest.fn(),
}));

jest.mock("@/hooks/useHasMounted", () => ({
        useHasMounted: () => true,
}));

jest.mock("next/navigation", () => ({
        usePathname: jest.fn(() => "/"),
        useRouter: jest.fn(() => ({
                push: jest.fn(),
                replace: jest.fn(),
                prefetch: jest.fn(),
                refresh: jest.fn(),
                back: jest.fn(),
                forward: jest.fn(),
        })),
}));

const BentoPageMock = jest.fn(({ features }: { features: unknown }) => {
        return <div data-testid="bento" data-count={Array.isArray(features) ? features.length : 0} />;
});
jest.mock("@/components/bento/page", () => ({
        __esModule: true,
        default: BentoPageMock,
}));

jest.mock("@/components/common/CTASection", () => ({
        __esModule: true,
        CTASection: () => <div data-testid="cta" />,
}));

jest.mock("@/components/home/heros/Hero", () => ({
        __esModule: true,
        default: () => <div data-testid="hero" />,
}));

jest.mock("@/components/home/heros/HeroSessionMonitor", () => ({
        __esModule: true,
        default: () => <div data-testid="hero-monitor" />,
}));

jest.mock("@/components/home/heros/HeroSessionMonitorClientWithModal", () => ({
        __esModule: true,
        default: () => <div data-testid="hero-monitor-modal" />,
}));

jest.mock("@/components/home/BlogPreview", () => ({
        __esModule: true,
        BlogPreview: () => <div data-testid="blog-preview" />,
}));

jest.mock("@/components/ui/separator", () => ({
        __esModule: true,
        Separator: () => <hr data-testid="separator" />,
}));

const TechStackSectionMock = jest.fn(({ stacks }: { stacks: unknown[] }) => (
        <div data-testid="tech-stack" data-count={stacks.length} />
));
jest.mock("@/components/common/TechStackSection", () => ({
        __esModule: true,
        TechStackSection: TechStackSectionMock,
}));

const TimelineMock = jest.fn(({ data }: { data: unknown[] }) => (
        <div data-testid="timeline" data-count={data.length} />
));
jest.mock("@/components/ui/timeline", () => ({
        __esModule: true,
        TimelineDealScales: TimelineMock,
        Timeline: TimelineMock,
}));

const ServiceCardMock = jest.fn(({ title }: { title: string }) => <div>{title}</div>);
const ServiceFilterMock = jest.fn(() => null);
const TabsMock = jest.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>);
const TabsListMock = jest.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>);
const TabsTriggerMock = jest.fn(({ children }: { children: React.ReactNode }) => <button>{children}</button>);
const TabsContentMock = jest.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>);

jest.mock("@/components/services/ServiceCard", () => ({
        __esModule: true,
        default: ServiceCardMock,
}));

jest.mock("@/components/services/ServiceFilter", () => ({
        __esModule: true,
        default: ServiceFilterMock,
}));

jest.mock("@/components/ui/tabs", () => ({
        __esModule: true,
        Tabs: TabsMock,
        TabsList: TabsListMock,
        TabsTrigger: TabsTriggerMock,
        TabsContent: TabsContentMock,
}));

const CategoryFilterMock = jest.fn(() => <div data-testid="category-filter" />);
const useCategoryFilterMock = jest.fn(() => ({
        activeCategory: "",
        setActiveCategory: jest.fn(),
        CategoryFilter: CategoryFilterMock,
}));

jest.mock("@/hooks/use-category-filter", () => ({
        useCategoryFilter: (...args: unknown[]) => useCategoryFilterMock(...args),
}));

const TrustedByMock = jest.fn(({ items }: { items: unknown }) => {
        const size = items ? Object.keys(items as Record<string, unknown>).length : 0;
        return <div data-testid="trusted" data-size={size} />;
});
jest.mock("@/components/contact/utils/TrustedByScroller", () => ({
        __esModule: true,
        default: TrustedByMock,
}));

const TestimonialsMock = jest.fn(({ testimonials }: { testimonials: unknown[] }) => (
        <div data-testid="testimonials" data-count={testimonials.length} />
));
jest.mock("@/components/home/Testimonials", () => ({
        __esModule: true,
        default: TestimonialsMock,
}));

const IntersectionObserverStub = class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
                return [];
        }
};

beforeAll(() => {
        Object.defineProperty(globalThis, "IntersectionObserver", {
                writable: true,
                configurable: true,
                value: IntersectionObserverStub,
        });
});

describe("marketing components use data modules", () => {
        beforeEach(() => {
                jest.clearAllMocks();
                useDataModuleMock.mockReset();
                useCategoryFilterMock.mockClear();
        });

        it("loads features for ClientBento from the data module", () => {
                const { default: ClientBento } = require("../home/ClientBento");

                const mockFeatures = [{ id: "f1" }, { id: "f2" }];
                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "bento/main") {
                                const state = {
                                        status: "ready",
                                        data: { MainBentoFeatures: mockFeatures },
                                        error: undefined,
                                };
                                return selector(state);
                        }
                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<ClientBento />);

                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "bento/main",
                        expect.any(Function),
                );

                const bentoCall =
                        BentoPageMock.mock.calls[BentoPageMock.mock.calls.length - 1] ?? [];
                const [bentoProps] = bentoCall;
                expect(bentoProps).toMatchObject({ features: mockFeatures });
        });

        it("treats idle module status as a loading state for ClientBento", () => {
                const { default: ClientBento } = require("../home/ClientBento");

                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "bento/main") {
                                return selector({
                                        status: "idle",
                                        data: undefined,
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<ClientBento />);

                expect(
                        screen.getByText(/Loading feature highlights/i),
                ).toBeInTheDocument();
                expect(BentoPageMock).not.toHaveBeenCalled();
        });

        it("hydrates service marketing clients via data modules", () => {
                const { default: ServiceHomeClient } = require("../../app/features/ServiceHomeClient");

                const integrationsStacks = [
                        {
                                category: "CRM",
                                libraries: [
                                        {
                                                name: "HubSpot",
                                                description: "CRM integration",
                                                lucideIcon: "Database",
                                        },
                                ],
                        },
                ];
                const bentoFeatures = [
                        {
                                id: "feature-1",
                                title: "Feature",
                                description: "Description",
                        },
                        {
                                id: "feature-2",
                                title: "Feature 2",
                                description: "Description",
                        },
                ];
                const featureTimeline = [
                        {
                                title: "Launch",
                                subtitle: "2024",
                                content: <div>Launched</div>,
                        },
                ];

                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "service/slug_data/integrations") {
                                return selector({
                                        status: "ready",
                                        data: {
                                                leadGenIntegrations: integrationsStacks,
                                        },
                                        error: undefined,
                                });
                        }
                        if (key === "bento/main") {
                                return selector({
                                        status: "ready",
                                        data: {
                                                MainBentoFeatures: bentoFeatures,
                                        },
                                        error: undefined,
                                });
                        }
                        if (key === "features/feature_timeline") {
                                return selector({
                                        status: "ready",
                                        data: { featureTimeline },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<ServiceHomeClient />);

                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "service/slug_data/integrations",
                        expect.any(Function),
                );
                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "bento/main",
                        expect.any(Function),
                );
                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "features/feature_timeline",
                        expect.any(Function),
                );

                const techStackCall =
                        TechStackSectionMock.mock.calls[TechStackSectionMock.mock.calls.length - 1] ?? [];
                const [techStackProps] = techStackCall;
                expect(techStackProps).toMatchObject({ stacks: integrationsStacks });

                const bentoCall =
                        BentoPageMock.mock.calls[BentoPageMock.mock.calls.length - 1] ?? [];
                const [bentoProps] = bentoCall;
                expect(bentoProps).toMatchObject({ features: bentoFeatures });

                const timelineCall =
                        TimelineMock.mock.calls[TimelineMock.mock.calls.length - 1] ?? [];
                const [timelineProps] = timelineCall;
                expect(timelineProps).toMatchObject({ data: featureTimeline });
        });

        it("derives service catalog entries from data modules", () => {
                const { default: Services } = require("../home/Services");

                const serviceItem = {
                        id: "svc",
                        slugDetails: { slug: "svc" },
                        iconName: "Zap",
                        title: "Service",
                        description: "desc",
                        features: ["feature"],
                        categories: ["lead_generation"],
                };

                const servicesByCategory = {
                        lead_generation: {
                                svc: serviceItem,
                        },
                };

                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "service/services") {
                                const getServicesByCategory = jest.fn(
                                        (category: string) => servicesByCategory[category] ?? {},
                                );

                                return selector({
                                        status: "ready",
                                        data: {
                                                services: servicesByCategory,
                                                getServicesByCategory,
                                        },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<Services showSearch showCategories />);

                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "service/services",
                        expect.any(Function),
                );
                const serviceCardCalls = ServiceCardMock.mock.calls.map(([props]) => props);
                expect(serviceCardCalls).toEqual(
                        expect.arrayContaining([
                                expect.objectContaining({ title: "Service" }),
                        ]),
                );
        });

        it("provides case study categories from the data module", () => {
                const { default: CaseStudyGrid } = require("../case-studies/CaseStudyGrid");

                const caseStudies = [
                        {
                                id: "cs",
                                title: "Case",
                                slug: "case",
                                subtitle: "",
                                featured: false,
                                categories: ["All"],
                                thumbnailImage: "/case.jpg",
                        },
                ];

                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "caseStudy/caseStudies") {
                                return selector({
                                        status: "ready",
                                        data: { caseStudyCategories: ["All", "New"], caseStudies },
                                        error: undefined,
                                });
                        }

                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<CaseStudyGrid caseStudies={caseStudies as any} />);

                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "caseStudy/caseStudies",
                        expect.any(Function),
                );
                expect(useCategoryFilterMock).toHaveBeenCalledWith(["All", "New"]);
        });

        it("hydrates newsletter client from data modules", () => {
                const { default: NewsletterClient } = require("../../app/newsletter/NewsletterClient");

                const newsletterTestimonials = [
                        {
                                id: 1,
                                name: "Investor Jane",
                                role: "Founder",
                                content: "Deal Scale transformed our pipeline.",
                                problem: "Lead volume was inconsistent.",
                                solution: "Deal Scale automated outreach and qualification.",
                                rating: 5,
                                company: "PropCo",
                                image: "/avatars/jane.png",
                        },
                ];
                const trustedCompanies = {
                        first: {
                                name: "Test",
                                logo: "/logo.png",
                                description: "Beta partner",
                        },
                };

                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "service/slug_data/testimonials") {
                                return selector({
                                        status: "ready",
                                        data: {
                                                generalDealScaleTestimonials: newsletterTestimonials,
                                        },
                                        error: undefined,
                                });
                        }
                        if (key === "service/slug_data/trustedCompanies") {
                                return selector({
                                        status: "ready",
                                        data: {
                                                companyLogos: trustedCompanies,
                                        },
                                        error: undefined,
                                });
                        }
                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<NewsletterClient posts={[]} />);

                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "service/slug_data/testimonials",
                        expect.any(Function),
                );
                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "service/slug_data/trustedCompanies",
                        expect.any(Function),
                );
                const trustedByCall =
                        TrustedByMock.mock.calls[TrustedByMock.mock.calls.length - 1] ?? [];
                const [trustedByProps] = trustedByCall;
                expect(trustedByProps).toMatchObject({ items: trustedCompanies });

                const testimonialsCall =
                        TestimonialsMock.mock.calls[TestimonialsMock.mock.calls.length - 1] ?? [];
                const [testimonialsProps] = testimonialsCall;
                expect(testimonialsProps).toMatchObject({ testimonials: newsletterTestimonials });
        });

        it("loads about page defaults from data modules", () => {
                const { default: AboutHero } = require("../about/AboutHero");
                const { default: AboutTeam } = require("../about/AboutTeam");
                const { default: AboutTimeline } = require("../about/AboutTimeline");

                useDataModuleMock.mockImplementation((key: string, selector: (value: any) => any) => {
                        if (key === "about/hero") {
                                return selector({
                                        status: "ready",
                                        data: { hero: { title: "Hero", subtitle: "Sub" } },
                                        error: undefined,
                                });
                        }
                        if (key === "about/team") {
                                return selector({
                                        status: "ready",
                                        data: {
                                                teamMembers: [
                                                        {
                                                                name: "Teammate",
                                                                role: "Engineer",
                                                                photoUrl: "/team.jpg",
                                                                joined: "2023",
                                                                expertise: ["AI", "Automation"],
                                                                bio: "Experienced builder focused on AI-driven growth.",
                                                                linkedin: "https://linkedin.com/in/teammate",
                                                        },
                                                ],
                                        },
                                        error: undefined,
                                });
                        }
                        if (key === "about/timeline") {
                                return selector({
                                        status: "ready",
                                        data: {
                                                timeline: [
                                                        {
                                                                title: "Founded",
                                                                subtitle: "2022",
                                                                content: <div>Deal Scale launched.</div>,
                                                        },
                                                ],
                                        },
                                        error: undefined,
                                });
                        }
                        return selector({ status: "ready", data: {}, error: undefined });
                });

                render(<AboutHero />);
                render(<AboutTeam />);
                render(<AboutTimeline />);

                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "about/hero",
                        expect.any(Function),
                );
                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "about/team",
                        expect.any(Function),
                );
                expect(useDataModuleMock).toHaveBeenCalledWith(
                        "about/timeline",
                        expect.any(Function),
                );
        });
});
