import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Metadata } from "next";

vi.mock("@/data/bento/main", () => ({
	MainBentoFeatures: [],
}));

const makeMockComponent = () => vi.fn(() => null);

const TrustedByScrollerMock = makeMockComponent();
vi.mock("@/components/contact/utils/TrustedByScroller", () => ({
	__esModule: true,
	default: TrustedByScrollerMock,
}));

const CaseStudyGridMock = makeMockComponent();
vi.mock("@/components/case-studies/CaseStudyGrid", () => ({
	__esModule: true,
	default: CaseStudyGridMock,
}));

const TestimonialsMock = makeMockComponent();
vi.mock("@/components/home/Testimonials", () => ({
	__esModule: true,
	default: TestimonialsMock,
}));

const FaqMock = makeMockComponent();
vi.mock("@/components/faq", () => ({
	__esModule: true,
	default: FaqMock,
}));

const MarketingCatalogPricingMock = makeMockComponent();
vi.mock("@/components/pricing/CatalogPricing", () => ({
	__esModule: true,
	default: MarketingCatalogPricingMock,
}));

vi.mock("@/lib/beehiiv/getPosts", () => ({
	__esModule: true,
	getLatestBeehiivPosts: vi.fn(async () => []),
}));

vi.mock("@/utils/seo/staticSeo", () => ({
	__esModule: true,
	getStaticSeo: vi.fn(() => ({
		canonical: "https://example.test",
		title: "Example Page",
		description: "Example description",
	})),
}));

vi.mock("@/utils/seo/mapSeoMetaToMetadata", () => ({
	__esModule: true,
	mapSeoMetaToMetadata: vi.fn((seo) => seo as Metadata),
}));

const mockPricingClient = vi.fn(() => null);
const dynamicWrappers: Array<(props: unknown) => React.ReactElement | null> =
	[];
vi.mock("next/dynamic", async () => {
	return {
		__esModule: true,
		default: () => {
			const Wrapper = (props: unknown) => {
				mockPricingClient(props);
				return null;
			};
			dynamicWrappers.push(Wrapper);
			return Wrapper;
		},
	};
});

const mockSchemaInjector = vi.fn();
function SchemaInjectorMock({
	schema,
}: { schema: unknown }): React.ReactElement | null {
	mockSchemaInjector(schema);
	return null;
}
const mockBuildFAQPageSchema = vi.fn(() => ({}));
const mockBuildServiceSchema = vi.fn(() => ({}));
const mockBuildActivityFeedSchema = vi.fn(() => ({}));
const mockBuildPricingJsonLd = vi.fn(() => []);
vi.mock("@/utils/seo/schema", () => ({
	__esModule: true,
	SchemaInjector: SchemaInjectorMock,
	buildFAQPageSchema: (...args: unknown[]) => mockBuildFAQPageSchema(...args),
	buildServiceSchema: (...args: unknown[]) => mockBuildServiceSchema(...args),
	buildActivityFeedSchema: (...args: unknown[]) =>
		mockBuildActivityFeedSchema(...args),
	buildPricingJsonLd: (...args: unknown[]) => mockBuildPricingJsonLd(...args),
}));

const mockServiceHomeClient = vi.fn(() => null);
function ServiceHomeClientWrapper(props: unknown): React.ReactElement | null {
	mockServiceHomeClient(props);
	return null;
}
vi.mock("../features/ServiceHomeClient", () => ({
	__esModule: true,
	default: ServiceHomeClientWrapper,
}));

const mockDataModules: Record<string, Record<string, unknown>> = {};
vi.mock("@/data/__generated__/modules", () => ({
	__esModule: true,
	dataModules: mockDataModules,
}));

function collectElements(
	node: React.ReactNode,
	collected: React.ReactElement[] = [],
): React.ReactElement[] {
	if (node === null || node === undefined) {
		return collected;
	}

	if (Array.isArray(node)) {
		for (const child of node) {
			collectElements(child, collected);
		}
		return collected;
	}

	if (React.isValidElement(node)) {
		collected.push(node);
		collectElements(node.props?.children, collected);
	}

	return collected;
}

describe("server entry pages", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		dynamicWrappers.length = 0;

		Object.assign(mockDataModules, {
			"caseStudy/caseStudies": {
				caseStudies: [
					{
						id: "cs-1",
						title: "Case Study 1",
						slug: "case-study-1",
						subtitle: "subtitle",
						featured: false,
						categories: ["all"],
						thumbnailImage: "/case-study.jpg",
					},
				],
			},
			"faq/default": {
				faqItems: [
					{
						question: "Q?",
						answer: "A",
					},
				],
			},
			"service/slug_data/pricing": {
				PricingPlans: [
					{
						id: "plan-1",
						name: "Plan",
						price: {},
					},
				],
				pricingCatalog: {
					pricing: {
						monthly: [],
						annual: [],
						oneTime: [],
					},
				},
			},
			"service/slug_data/testimonials": {
				generalDealScaleTestimonials: [
					{
						id: "test-1",
						quote: "Great",
						name: "Ada",
					},
				],
			},
			"service/slug_data/trustedCompanies": {
				companyLogos: {
					company: {
						name: "Co",
						logo: "/logo.svg",
					},
				},
			},
			"service/slug_data/faq": {
				leadGenFAQ: {
					faqItems: [
						{
							question: "Lead?",
							answer: "Yes",
						},
					],
				},
			},
		});
	});

	afterEach(() => {
		for (const key of Object.keys(mockDataModules)) {
			delete mockDataModules[key];
		}
	});

	it("hydrates the home page from data modules", async () => {
		const Index = (await import("../page")).default;

		const tree = await Index();
		const elements = collectElements(tree);

		const scroller = elements.find(
			(element) => element.type === TrustedByScrollerMock,
		);
		const caseStudiesGrid =
			elements.find((element) => element.type === CaseStudyGridMock) ??
			elements.find(
				(element) =>
					element?.props !== null &&
					typeof element?.props === "object" &&
					"caseStudies" in (element.props as Record<string, unknown>),
			);
		const testimonials =
			elements.find((element) => element.type === TestimonialsMock) ??
			elements.find(
				(element) =>
					element?.props !== null &&
					typeof element?.props === "object" &&
					"testimonials" in (element.props as Record<string, unknown>),
			);
		const faq =
			elements.find((element) => element.type === FaqMock) ??
			elements.find(
				(element) =>
					element?.props !== null &&
					typeof element?.props === "object" &&
					"faqItems" in (element.props as Record<string, unknown>),
			);
		const marketingPricing =
			elements.find(
				(element) => element.type === MarketingCatalogPricingMock,
			) ??
			elements.find(
				(element) =>
					element?.props !== null &&
					typeof element?.props === "object" &&
					"catalog" in (element.props as Record<string, unknown>),
			);

		expect(scroller?.props).toMatchObject({
			items: mockDataModules["service/slug_data/trustedCompanies"].companyLogos,
		});
		expect(caseStudiesGrid?.props).toMatchObject({
			caseStudies: mockDataModules["caseStudy/caseStudies"].caseStudies,
		});
		expect(testimonials?.props).toMatchObject({
			testimonials:
				mockDataModules["service/slug_data/testimonials"]
					.generalDealScaleTestimonials,
		});
		expect(faq?.props).toMatchObject({
			faqItems: mockDataModules["faq/default"].faqItems,
		});
		expect(marketingPricing?.props).toMatchObject({
			catalog: mockDataModules["service/slug_data/pricing"].pricingCatalog,
		});
	});

	it("hydrates the pricing page from data modules", async () => {
		const PricingPage = (await import("../pricing/page")).default;

		const tree = PricingPage();
		const elements = collectElements(tree);

		expect(mockBuildPricingJsonLd).toHaveBeenCalledWith(
			expect.objectContaining({
				catalog: mockDataModules["service/slug_data/pricing"].pricingCatalog,
			}),
		);

		const schemaElement = elements.find(
			(element) => element.type === SchemaInjectorMock,
		);

		expect(schemaElement).toBeDefined();
		expect(schemaElement?.props.schema).toBeDefined();

		expect(mockBuildFAQPageSchema).toHaveBeenCalledWith(
			expect.objectContaining({
				faqs: mockDataModules[
					"service/slug_data/faq"
				].leadGenFAQ.faqItems.slice(0, 8),
			}),
		);
	});

	it("hydrates the features page from data modules", async () => {
		const ServicesPage = (await import("../features/page")).default;

		const tree = ServicesPage();
		const elements = collectElements(tree);
		const clientElement = elements.find(
			(element) => element.type === ServiceHomeClientWrapper,
		);
		const schemaElement = elements.find(
			(element) => element.type === SchemaInjectorMock,
		);

		expect(mockBuildFAQPageSchema).toHaveBeenCalledWith(
			expect.objectContaining({
				faqs: mockDataModules["faq/default"].faqItems.slice(0, 8),
			}),
		);
		expect(schemaElement).toBeDefined();
		expect(schemaElement?.props.schema).toBeDefined();
		expect(clientElement).toBeDefined();
	});
});
