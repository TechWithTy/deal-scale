import type { MetadataRoute } from "next";

const CANONICAL_HOST = "https://dealscale.io";
const ALLOWED_ROUTES = [
        "/",
        "/blogs",
        "/case-studies",
        "/events",
        "/partners",
        "/features",
        "/pricing",
        "/products",
];
// ! /careers is intentionally excluded because Next.js redirects to Zoho Recruit.
const DISALLOWED_PATHS = [
        "/api/",
        "/admin/",
        "/drafts/",
        "/private/",
        "/sandbox/",
];

type RobotsRule = Extract<MetadataRoute.Robots["rules"], Array<unknown>> extends Array<infer Rule>
        ? Rule
        : never;

function createRule(userAgent: string, crawlDelay?: number): RobotsRule {
        return {
                userAgent,
                allow: ALLOWED_ROUTES,
                disallow: DISALLOWED_PATHS,
                crawlDelay,
        };
}

export default function robots(): MetadataRoute.Robots {
        return {
                host: CANONICAL_HOST,
                sitemap: [`${CANONICAL_HOST}/sitemap.xml`],
                rules: [
                        createRule("*"),
                        createRule("Googlebot"),
                        createRule("GPTBot", 10),
                        createRule("PerplexityBot", 10),
                        createRule("ClaudeBot", 10),
                ],
        };
}
