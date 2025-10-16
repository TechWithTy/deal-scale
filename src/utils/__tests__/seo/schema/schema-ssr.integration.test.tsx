import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server.node";

jest.mock("@/components/providers/AppProviders", () => ({
        AppProviders: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock("@/styles/fonts", () => ({
        sansFont: { variable: "font-sans" },
        monoFont: { variable: "font-mono" },
}));

jest.mock("@/app/features/ServiceHomeClient", () => ({
        __esModule: true,
        default: () => null,
}));

jest.mock("@/app/blogs/BlogClient", () => ({
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

describe("JSON-LD SSR integration", () => {
        beforeEach(() => {
                jest.resetModules();
        });

        it("renders organization and website schemas in the root layout", () => {
                const RootLayout = require("@/app/layout").default;
                const html = renderToStaticMarkup(
                        <RootLayout>
                                <main>content</main>
                        </RootLayout>,
                );

                const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];

                expect(scripts).toHaveLength(2);

                const [organizationSchema, websiteSchema] = scripts.map(([, json]) => JSON.parse(json));

                expect(organizationSchema["@type"]).toBe("Organization");
                expect(websiteSchema["@type"]).toBe("WebSite");
        });

        it("renders FAQ schema for the features landing page", () => {
                const ServicesPage = require("@/app/features/page").default;
                const html = renderToStaticMarkup(<ServicesPage />);
                const script = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);

                expect(script).not.toBeNull();

                const schema = JSON.parse(script?.[1] ?? "{}");

                expect(schema["@type"]).toBe("FAQPage");
                expect(schema.mainEntity).toBeInstanceOf(Array);
        });

        it("renders Blog schema with sanitized JSON-LD", async () => {
                const BlogsPage = (await import("@/app/blogs/page")).default;
                const element = await BlogsPage();
                const html = renderToStaticMarkup(element);

                const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
                expect(match).not.toBeNull();

                const json = match?.[1] ?? "";

                expect(json).not.toContain("</script>");

                const schema = JSON.parse(json);
                expect(schema["@type"]).toBe("Blog");
                expect(schema.blogPost).toBeInstanceOf(Array);
        });
});
