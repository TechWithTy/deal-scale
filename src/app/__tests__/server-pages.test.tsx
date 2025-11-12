import React from "react";

import type { Metadata } from "next";

jest.mock("@/data/bento/main", () => ({
	MainBentoFeatures: [],
}));

const makeMockComponent = () => jest.fn(() => null);

const TrustedByScrollerMock = makeMockComponent();
jest.mock("@/components/contact/utils/TrustedByScroller", () => ({
	__esModule: true,
	default: TrustedByScrollerMock,
}));

const CaseStudyGridMock = makeMockComponent();
jest.mock("@/components/case-studies/CaseStudyGrid", () => ({
	__esModule: true,
	default: CaseStudyGridMock,
}));

const TestimonialsMock = makeMockComponent();
jest.mock("@/components/home/Testimonials", () => ({
	__esModule: true,
	default: TestimonialsMock,
}));

const FaqMock = makeMockComponent();
jest.mock("@/components/faq", () => ({
	__esModule: true,
	default: FaqMock,
}));

const PricingMock = makeMockComponent();
jest.mock("@/components/home/Pricing", () => ({
	__esModule: true,
	default: PricingMock,
}));

jest.mock("@/lib/beehiiv/getPosts", () => ({
	__esModule: true,
	getLatestBeehiivPosts: jest.fn(async () => []),
}));

jest.mock("@/utils/seo/staticSeo", () => ({
	__esModule: true,
	getStaticSeo: jest.fn(() => ({
		canonical: "https://example.test",
		title: "Example Page",
		description: "Example description",
	})),
}));

jest.mock("@/utils/seo/mapSeoMetaToMetadata", () => ({
	__esModule: true,
	mapSeoMetaToMetadata: jest.fn((seo) => seo as Metadata),
}));

const mockPricingClient = jest.fn(() => null);
const dynamicWrappers: Array<(props: unknown) => React.ReactElement | null> =
	[];
jest.mock("next/dynamic", () => {
	return jest.fn(() => {
		const Wrapper = (props: unknown) => {
			mockPricingClient(props);
			return null;
		};
		dynamicWrappers.push(Wrapper);
		return Wrapper;
	});
});

const mockSchemaInjector = jest.fn();
function SchemaInjectorMock({
	schema,
}: { schema: unknown }): React.ReactElement | null {
	mockSchemaInjector(schema);
	return null;
}
const mockBuildFAQPageSchema = jest.fn(() => ({}));
const mockBuildServiceSchema = jest.fn(() => ({}));
const mockBuildActivityFeedSchema = jest.fn(() => ({}));
jest.mock("@/utils/seo/schema", () => ({
	__esModule: true,
	SchemaInjector: SchemaInjectorMock,
	buildFAQPageSchema: (...args: unknown[]) => mockBuildFAQPageSchema(...args),
	buildServiceSchema: (...args: unknown[]) =>
		mockBuildServiceSchema(...args),
	buildActivityFeedSchema: (...args: unknown[]) =>
		mockBuildActivityFeedSchema(...args),
}));

const mockServiceHomeClient = jest.fn(() => null);
function ServiceHomeClientWrapper(props: unknown): React.ReactElement | null {
	mockServiceHomeClient(props);
	return null;
}
jest.mock("../features/ServiceHomeClient", () => ({
	__esModule: true,
	default: ServiceHomeClientWrapper,
}));

const mockDataModules: Record<string, Record<string, unknown>> = {};
jest.mock("@/data/__generated__/modules", () => ({
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
		jest.clearAllMocks();

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
		dynamicWrappers.length = 0;
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
		const pricing =
			elements.find((element) => element.type === PricingMock) ??
			elements.find(
				(element) =>
					element?.props !== null &&
					typeof element?.props === "object" &&
					"plans" in (element.props as Record<string, unknown>),
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
		expect(pricing?.props).toMatchObject({
			plans: mockDataModules["service/slug_data/pricing"].PricingPlans,
		});
	});

	it("hydrates the pricing page from data modules", async () => {
		const PricingPage = (await import("../pricing/page")).default;

		const tree = PricingPage();
		const elements = collectElements(tree);
		const pricingWrapper = dynamicWrappers[0];

		expect(pricingWrapper).toBeDefined();

		const clientElement = elements.find(
			(element) => element.type === pricingWrapper,
		);

		expect(clientElement?.props).toMatchObject({
			plans: mockDataModules["service/slug_data/pricing"].PricingPlans,
		});

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
