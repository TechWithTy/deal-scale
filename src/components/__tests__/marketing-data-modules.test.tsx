import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type React from "react";

vi.mock("next-auth/react", () => ({
	__esModule: true,
	useSession: () => ({ data: null, status: "unauthenticated" }),
	SessionProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

vi.mock("@/data/bento/main", () => ({
	MainBentoFeatures: [],
}));

const useDataModuleMock = vi.fn();

vi.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
	createDataModuleStore: vi.fn(),
}));

vi.mock("@/hooks/useHasMounted", () => ({
	useHasMounted: () => true,
}));

const usePathnameMock = vi.fn(() => "/");
const useRouterMock = vi.fn(() => ({
	push: vi.fn(),
	replace: vi.fn(),
	prefetch: vi.fn(),
	refresh: vi.fn(),
	back: vi.fn(),
	forward: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	__esModule: true,
	usePathname: (...args: unknown[]) => usePathnameMock(...args),
	useRouter: (...args: unknown[]) => useRouterMock(...args),
}));

const BentoPageMock = vi.fn(({ features }: { features: unknown }) => {
	return (
		<div
			data-testid="bento"
			data-count={Array.isArray(features) ? features.length : 0}
		/>
	);
});
vi.mock("@/components/bento/page", () => ({
	__esModule: true,
	default: BentoPageMock,
}));

vi.mock("@/components/common/CTASection", () => ({
	__esModule: true,
	CTASection: () => <div data-testid="cta" />,
}));

vi.mock("@/components/home/heros/Hero", () => ({
	__esModule: true,
	default: () => <div data-testid="hero" />,
}));

vi.mock("@/components/home/heros/HeroSessionMonitor", () => ({
	__esModule: true,
	default: () => <div data-testid="hero-monitor" />,
}));

vi.mock("@/components/home/heros/HeroSessionMonitorClientWithModal", () => ({
	__esModule: true,
	default: () => <div data-testid="hero-monitor-modal" />,
}));

vi.mock("@/components/home/BlogPreview", () => ({
	__esModule: true,
	BlogPreview: () => <div data-testid="blog-preview" />,
}));

vi.mock("@/components/ui/separator", () => ({
	__esModule: true,
	Separator: () => <hr data-testid="separator" />,
}));

const TechStackSectionMock = vi.fn(({ stacks }: { stacks: unknown[] }) => (
	<div data-testid="tech-stack" data-count={stacks.length} />
));
vi.mock("@/components/common/TechStackSection", () => ({
	__esModule: true,
	TechStackSection: TechStackSectionMock,
}));

const FeatureTimelineTableMock = vi.fn(({ rows }: { rows: unknown[] }) => (
	<div data-testid="timeline-table" data-count={rows.length} />
));
vi.mock("@/components/features/FeatureTimelineTable", () => ({
	__esModule: true,
	FeatureTimelineTable: FeatureTimelineTableMock,
}));

const ServiceCardMock = vi.fn(({ title }: { title: string }) => (
	<div>{title}</div>
));
const ServiceFilterMock = vi.fn(() => null);
const TabsMock = vi.fn(({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
));
const TabsListMock = vi.fn(({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
));
const TabsTriggerMock = vi.fn(
	({ children }: { children: React.ReactNode }) => <button>{children}</button>,
);
const TabsContentMock = vi.fn(
	({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);

vi.mock("@/components/services/ServiceCard", () => ({
	__esModule: true,
	default: ServiceCardMock,
}));

vi.mock("@/components/services/ServiceFilter", () => ({
	__esModule: true,
	default: ServiceFilterMock,
}));

vi.mock("@/components/ui/tabs", () => ({
	__esModule: true,
	Tabs: TabsMock,
	TabsList: TabsListMock,
	TabsTrigger: TabsTriggerMock,
	TabsContent: TabsContentMock,
}));

const CategoryFilterMock = vi.fn(() => <div data-testid="category-filter" />);
const useCategoryFilterMock = vi.fn(() => ({
	activeCategory: "",
	setActiveCategory: vi.fn(),
	CategoryFilter: CategoryFilterMock,
}));

vi.mock("@/hooks/use-category-filter", () => ({
	useCategoryFilter: (...args: unknown[]) => useCategoryFilterMock(...args),
}));

const TrustedByMock = vi.fn(({ items }: { items: unknown }) => {
	const size = items ? Object.keys(items as Record<string, unknown>).length : 0;
	return <div data-testid="trusted" data-size={size} />;
});
vi.mock("@/components/contact/utils/TrustedByScroller", () => ({
	__esModule: true,
	default: TrustedByMock,
}));

const TestimonialsMock = vi.fn(
	({ testimonials }: { testimonials: unknown[] }) => (
		<div data-testid="testimonials" data-count={testimonials.length} />
	),
);
vi.mock("@/components/home/Testimonials", () => ({
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

const loadClientBento = async () =>
	(await import("../home/ClientBento")).default;
const loadServices = async () => (await import("../home/Services")).default;
const loadCaseStudyGrid = async () =>
	(await import("../case-studies/CaseStudyGrid")).default;
const loadNewsletterClient = async () =>
	(await import("../../app/newsletter/NewsletterClient")).default;
const loadServiceHomeClient = async () =>
	(await import("../../app/features/ServiceHomeClient")).default;
const loadContactClient = async () =>
	(await import("../../app/contact/ContactClient")).default;

const resetMocks = () => {
	vi.clearAllMocks();
	useDataModuleMock.mockReset();
	useCategoryFilterMock.mockClear();
};

describe("marketing components use data modules", () => {
	beforeEach(() => {
		resetMocks();
	});

	it("loads features for ClientBento from the data module", async () => {
		const ClientBento = await loadClientBento();

		const mockFeatures = [{ id: "f1" }, { id: "f2" }];
		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
				if (key === "bento/main") {
					const state = {
						status: "ready",
						data: { MainBentoFeatures: mockFeatures },
						error: undefined,
					};
					return selector(state);
				}
				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

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

	it("treats idle module status as a loading state for ClientBento", async () => {
		const ClientBento = await loadClientBento();

		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
				if (key === "bento/main") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		render(<ClientBento />);

		expect(screen.getByText(/Loading feature highlights/i)).toBeInTheDocument();
		expect(BentoPageMock).not.toHaveBeenCalled();
	});

	it("hydrates service marketing clients via data modules", async () => {
		const ServiceHomeClient = await loadServiceHomeClient();

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
				quarter: "Q1 2024",
				status: "Live",
				initiative: "Launch",
				focus: "Automation",
				summary: "Initial launch milestone",
				highlights: ["Highlight 1"],
			},
		];

		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
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
			},
		);

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
			TechStackSectionMock.mock.calls[
				TechStackSectionMock.mock.calls.length - 1
			] ?? [];
		const [techStackProps] = techStackCall;
		expect(techStackProps).toMatchObject({ stacks: integrationsStacks });

		const bentoCall =
			BentoPageMock.mock.calls[BentoPageMock.mock.calls.length - 1] ?? [];
		const [bentoProps] = bentoCall;
		expect(bentoProps).toMatchObject({ features: bentoFeatures });

		const timelineCall =
			FeatureTimelineTableMock.mock.calls[
				FeatureTimelineTableMock.mock.calls.length - 1
			] ?? [];
		const [timelineProps] = timelineCall;
		expect(timelineProps).toMatchObject({ rows: featureTimeline });
	});

	it("derives service catalog entries from data modules", async () => {
		const Services = await loadServices();

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

		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
				if (key === "service/services") {
					const getServicesByCategory = vi.fn(
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
			},
		);

		render(<Services showSearch showCategories />);

		expect(useDataModuleMock).toHaveBeenCalledWith(
			"service/services",
			expect.any(Function),
		);
		const serviceCardCalls = ServiceCardMock.mock.calls.map(([props]) => props);
		expect(serviceCardCalls).toEqual(
			expect.arrayContaining([expect.objectContaining({ title: "Service" })]),
		);
	});

	it("provides case study categories from the data module", async () => {
		const CaseStudyGrid = await loadCaseStudyGrid();

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

		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
				if (key === "caseStudy/caseStudies") {
					return selector({
						status: "ready",
						data: { caseStudyCategories: ["All", "New"], caseStudies },
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		render(<CaseStudyGrid caseStudies={caseStudies as any} />);

		expect(useDataModuleMock).toHaveBeenCalledWith(
			"caseStudy/caseStudies",
			expect.any(Function),
		);
		expect(useCategoryFilterMock).toHaveBeenCalledWith(["All", "New"]);
	});

	it("hydrates newsletter client from data modules", async () => {
		const NewsletterClient = await loadNewsletterClient();

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

		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
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
			},
		);

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
		expect(testimonialsProps).toMatchObject({
			testimonials: newsletterTestimonials,
		});
	});

	it("loads about page defaults from data modules", async () => {
		const AboutHero = (await import("../about/AboutHero")).default;
		const AboutTeam = (await import("../about/AboutTeam")).default;
		const AboutTimeline = (await import("../about/AboutTimeline")).default;

		useDataModuleMock.mockImplementation(
			(key: string, selector: (value: any) => any) => {
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
			},
		);

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
