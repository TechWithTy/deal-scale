import React, { type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server.node";

import { caseStudies } from "@/data/caseStudy/caseStudies";
import { mockProducts } from "@/data/products";
import { services as serviceCatalog } from "@/data/service/services";

const eventFixture = {
        id: "event-1",
        slug: "test-event",
        title: "Testing Structured Data",
        date: "2025-01-15",
        time: "09:00-11:00",
        description: "SSR-only schema with </script> edge cases",
        externalUrl: "https://example.com/events/test-event",
        category: "Webinar",
        location: "Online",
        thumbnailImage: "https://example.com/event.jpg",
};

const fetchEventsMock = jest.fn().mockResolvedValue([eventFixture]);
function nullComponentMock() {
        return { __esModule: true, default: () => null };
}

jest.mock("@/components/providers/AppProviders", () => ({
        AppProviders: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock("@/styles/fonts", () => ({
        sansFont: { variable: "font-sans" },
        monoFont: { variable: "font-mono" },
}));
jest.mock("@/app/features/ServiceHomeClient", nullComponentMock);
jest.mock("@/app/blogs/BlogClient", nullComponentMock);
jest.mock("@/app/partners/PartnersClient", nullComponentMock);
jest.mock("@/app/products/ProductsClient", nullComponentMock);
jest.mock("@/app/products/[slug]/ProductClient", nullComponentMock);
jest.mock("@/components/services/ServicePageClient", nullComponentMock);
jest.mock("@/app/events/EventClient", nullComponentMock);
jest.mock("@/app/case-studies/[slug]/CaseStudyPageClient", nullComponentMock);
jest.mock("@/components/common/CTASection", () => ({
        CTASection: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));
const simpleDivMocks: Array<[string, string]> = [
        ["@/components/about/AboutUsSection", "AboutUsSection"],
        ["@/components/case-studies/CaseStudyGrid", "CaseStudyGrid"],
        ["@/components/contact/form/ContactForm", "ContactForm"],
        ["@/components/contact/utils/TrustedByScroller", "TrustedByScroller"],
        ["@/components/faq", "Faq"],
        ["@/components/home/ClientBento", "ClientBento"],
        ["@/components/home/FeatureVote", "UpcomingFeatures"],
        ["@/components/home/Pricing", "Pricing"],
        ["@/components/home/Services", "Services"],
        ["@/components/home/Testimonials", "Testimonials"],
        ["@/components/home/heros/HeroSessionMonitorClientWithModal", "HeroSessionMonitor"],
];

for (const [modulePath, label] of simpleDivMocks) {
        jest.mock(modulePath, () => ({
                __esModule: true,
                default: () => <div>{label}</div>,
        }));
}

jest.mock("@/components/common/ViewportLazy", () => {
        const PassThrough = ({ children }: { children?: ReactNode }) => <>{children}</>;
        return {
                __esModule: true,
                ViewportLazy: PassThrough,
                default: PassThrough,
        };
});

jest.mock("@/components/home/BlogPreview", () => {
        const Mock = () => <div>BlogPreview</div>;
        return { __esModule: true, BlogPreview: Mock, default: Mock };
});

jest.mock("@/components/ui/separator", () => {
        const Separator = () => <hr />;
        return { __esModule: true, Separator, default: Separator };
});
jest.mock("lottie-react", () => ({
        __esModule: true,
        default: () => null,
}));
jest.mock("@/lib/beehiiv/getPosts", () => ({
        getLatestBeehiivPosts: jest.fn().mockResolvedValue([
                {
                        id: "1",
                        subtitle: "",
                        title: "Test Post",
                        slug: "test-post",
                        published_at: "2024-01-01T00:00:00.000Z",
                        authors: ["Author"],
                        web_url: "https://example.com/posts/test-post",
                        content_tags: ["AI"],
                        thumbnail_url: "https://example.com/image.jpg",
                },
        ]),
}));
jest.mock("@/lib/events/fetchEvents", () => ({ fetchEvents: (...args: unknown[]) => fetchEventsMock(...args) }));
jest.mock("next/dynamic", () => ({
        __esModule: true,
        default: (importer: () => Promise<unknown>, options?: { loading?: () => ReactElement }) => {
                const Fallback = options?.loading ?? (() => null);
                const DynamicComponent = () => Fallback();
                return DynamicComponent;
        },
}));
jest.mock("next/navigation", () => ({
        notFound: () => {
                throw new Error("next.notFound");
        },
        useRouter: () => ({
                back: jest.fn(),
                forward: jest.fn(),
                prefetch: jest.fn(),
                push: jest.fn(),
                refresh: jest.fn(),
                replace: jest.fn(),
        }),
}));
jest.mock("next/image", () => ({
        __esModule: true,
        default: ({ priority: _priority, ...props }: React.ComponentPropsWithoutRef<"img"> & { priority?: boolean }) => (
                <img {...props} />
        ),
}));
jest.mock("next/link", () => ({
        __esModule: true,
        default: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => <a {...props}>{children}</a>,
}));

const schemaScriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function extractJsonLdScripts(html: string): string[] {
        return [...html.matchAll(schemaScriptRegex)].map(([, json]) => json);
}

async function renderAsync(element: ReactElement | Promise<ReactElement>): Promise<string> {
        return renderToStaticMarkup(await Promise.resolve(element));
}

describe("JSON-LD SSR integration", () => {
        beforeEach(() => {
                fetchEventsMock.mockReset();
                fetchEventsMock.mockResolvedValue([eventFixture]);
        });

        it("renders organization and website schemas in the root layout", async () => {
                const { default: RootLayout } = await import("@/app/layout");
                const html = renderToStaticMarkup(
                        <RootLayout>
                                <main>content</main>
                        </RootLayout>,
                );
                const scripts = extractJsonLdScripts(html);
                expect(scripts).toHaveLength(2);
                const [organizationSchema, websiteSchema] = scripts.map((json) => JSON.parse(json));
                expect(organizationSchema["@type"]).toBe("Organization");
                expect(websiteSchema["@type"]).toBe("WebSite");
        });

        it("renders organization and website schemas in the document head", async () => {
                const { default: Head } = await import("@/app/head");
                const scripts = extractJsonLdScripts(renderToStaticMarkup(Head()));
                expect(scripts).toHaveLength(2);
                expect(JSON.parse(scripts[0])["@type"]).toBe("Organization");
                expect(JSON.parse(scripts[1])["@type"]).toBe("WebSite");
        });

        it("keeps JSON-LD scripts in the SSR response for the homepage", async () => {
                const { default: RootLayout } = await import("@/app/layout");
                const { default: HomePage } = await import("@/app/page");

                const homeContent = await HomePage();
                const html = renderToStaticMarkup(
                        <RootLayout>
                                {homeContent}
                        </RootLayout>,
                );

                const scripts = extractJsonLdScripts(html);

                expect(scripts).toHaveLength(2);

                const parsed = scripts.map((json) => JSON.parse(json));

                expect(parsed[0]["@type"]).toBe("Organization");
                expect(parsed[1]["@type"]).toBe("WebSite");
        });

        it.each([
                {
                        description: "features landing page",
                        render: async () => {
                                const { default: FeaturesPage } = await import("@/app/features/page");
                                return renderToStaticMarkup(<FeaturesPage />);
                        },
                },
                {
                        description: "pricing page",
                        render: async () => {
                                const { default: PricingPage } = await import("@/app/pricing/page");
                                return renderToStaticMarkup(<PricingPage />);
                        },
                },
        ])("renders FAQ schema for the $description", async ({ render }) => {
                const [script] = extractJsonLdScripts(await render());
                expect(script).toBeDefined();
                const schema = JSON.parse(script ?? "{}");
                expect(schema["@type"]).toBe("FAQPage");
                expect(Array.isArray(schema.mainEntity)).toBe(true);
        });

        it("renders sanitized Blog schema for the blogs index", async () => {
                const { default: BlogsPage } = await import("@/app/blogs/page");
                const [json] = extractJsonLdScripts(await renderAsync(await BlogsPage()));
                expect(json).toBeDefined();
                expect(json ?? "").not.toContain("</script>");
                const schema = JSON.parse(json ?? "{}");
                expect(schema["@type"]).toBe("Blog");
                expect(Array.isArray(schema.blogPost)).toBe(true);
        });

        it("renders partners item list schema", async () => {
                const { default: PartnersPage } = await import("@/app/partners/page");
                const [script] = extractJsonLdScripts(renderToStaticMarkup(<PartnersPage />));
                expect(script).toBeDefined();
                expect(JSON.parse(script ?? "{}")["@type"]).toBe("ItemList");
        });

        it("renders product list schema on the products index", async () => {
                const { default: ProductsPage } = await import("@/app/products/page");
                const [script] = extractJsonLdScripts(await renderAsync(await ProductsPage({ searchParams: Promise.resolve({}) }))); 
                expect(script).toBeDefined();
                const schema = JSON.parse(script ?? "[]");
                expect(Array.isArray(schema)).toBe(true);
                expect(schema.length).toBeGreaterThan(0);
                expect(schema[0]["@type"]).toBe("Product");
        });

        it("renders product schema for a product detail page", async () => {
                const { default: ProductPage } = await import("@/app/products/[slug]/page");
                const product = mockProducts[0];
                const [script] = extractJsonLdScripts(
                        await renderAsync(
                                await ProductPage({
                                        params: Promise.resolve({ slug: product.slug ?? product.sku }),
                                        searchParams: Promise.resolve({}),
                                }),
                        ),
                );
                expect(script).toBeDefined();
                const schema = JSON.parse(script ?? "{}");
                expect(schema["@type"]).toBe("Product");
                expect(schema.name).toBe(product.name);
        });

        it("renders service schema for a service detail page", async () => {
                const { default: ServicePage } = await import("@/app/features/[slug]/page");
                const services = Object.values(serviceCatalog).flatMap((category) =>
                        Object.values(category),
                );
                const service = services[0];
                expect(service).toBeDefined();

                const [script] = extractJsonLdScripts(
                        await renderAsync(
                                await ServicePage({
                                        params: { slug: service.slugDetails.slug },
                                }),
                        ),
                );

                expect(script).toBeDefined();
                expect(script ?? "").not.toContain("</script>");
                const schema = JSON.parse(script ?? "{}");
                expect(schema["@type"]).toBe("Service");
                expect(schema.name).toBe(service.title);
                expect(schema.url).toContain(service.slugDetails.slug);
        });

        it("renders events item list schema on the events index", async () => {
                const { default: EventsPage } = await import("@/app/events/page");
                const [script] = extractJsonLdScripts(await renderAsync(await EventsPage()));
                expect(fetchEventsMock).toHaveBeenCalled();
                expect(script).toBeDefined();
                const schema = JSON.parse(script ?? "{}");
                expect(schema["@type"]).toBe("ItemList");
                expect(Array.isArray(schema.itemListElement)).toBe(true);
        });

        it("renders event schema for the event detail page", async () => {
                const { default: EventDetailPage } = await import("@/app/events/[slug]/page");
                const [json] = extractJsonLdScripts(
                        await renderAsync(await EventDetailPage({ params: Promise.resolve({ slug: eventFixture.slug }) })),
                );
                expect(json).toBeDefined();
                expect(json ?? "").not.toContain("</script>");
                const schema = JSON.parse(json ?? "{}");
                expect(schema["@type"]).toBe("Event");
                expect(schema.url).toContain(eventFixture.slug);
        });

        it("renders creative work schema for a case study page", async () => {
                const { default: CaseStudyPage } = await import("@/app/case-studies/[slug]/page");
                const caseStudy = caseStudies[0];
                const [script] = extractJsonLdScripts(await renderAsync(await CaseStudyPage({ params: { slug: caseStudy.slug } })));
                expect(script).toBeDefined();
                const schema = JSON.parse(script ?? "{}");
                expect(schema["@type"]).toBe("CreativeWork");
                expect(schema.name).toBe(caseStudy.title);
        });
});

