import { DEFAULT_SEO } from "@/data/constants/seo";
import { staticSeoMeta } from "@/utils/seo/staticSeo";

type StaticSeoExpectation = {
        title: string;
        description: string;
        canonical: string;
        image: string;
        keywords: string[];
        priority?: number;
        changeFrequency?: string;
};

const cases: Array<[string, StaticSeoExpectation]> = [
        ["/blogs", {
                title: "Blogs | Deal Scale",
                description:
                        "See the latest insights, stories, and updates for real estate investors and wholesalers from the Deal Scale team.",
                canonical: "https://dealscale.io/blogs",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
                priority: 0.8,
                changeFrequency: "weekly",
        }],
        ["/contact", {
                title: "Beta Test Sign Up | Deal Scale",
                description:
                        "Get in touch with Deal Scale for expert AI-powered real estate solutions and support.",
                canonical: "https://dealscale.io/contact",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
                priority: 0.7,
                changeFrequency: "monthly",
        }],
        ["/case-studies", {
                title: "Case Studies | Deal Scale",
                description:
                        "Check out real-world solutions and success stories from real estate professionals using Deal Scale and its Technologies.",
                canonical: "https://dealscale.io/case-studies",
                image: "/banners/CaseStudy2.png",
                keywords: DEFAULT_SEO.keywords,
                priority: 0.8,
                changeFrequency: "weekly",
        }],
        ["/cookies", {
                title: "Cookies Policy | Deal Scale",
                description:
                        "Learn how Deal Scale uses cookies to enhance your experience and protect your privacy.",
                canonical: "https://dealscale.io/cookies",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
                priority: 0.3,
                changeFrequency: "yearly",
        }],
        ["/events", {
                title: "Events | Deal Scale",
                description:
                        "Stay updated on upcoming Deal Scale events, webinars, and real estate industry opportunities powered by AI.",
                canonical: "https://dealscale.io/events",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
        }],
        ["/faqs", {
                title: "FAQs | Deal Scale",
                description:
                        "Find answers to common questions about Deal Scale's services and AI-powered real estate solutions.",
                canonical: "https://dealscale.io/faq",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
        }],
        ["/portfolio", {
                title: "Portfolio | Deal Scale",
                description:
                        "Browse Deal Scale's portfolio to see AI-powered real estate solutions in action.",
                canonical: "https://dealscale.io/portfolio",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
        }],
        ["/privacy", {
                title: "Privacy Policy | Deal Scale",
                description:
                        "Read our Privacy Policy to understand how Deal Scale collects, uses, and protects your personal information.",
                canonical: "https://dealscale.io/privacy",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
                priority: 0.5,
                changeFrequency: "monthly",
        }],
        ["/tos", {
                title: "Terms of Service | Deal Scale",
                description:
                        "Review the terms and conditions for using Deal Scale’s website and services.",
                canonical: "https://dealscale.io/tos",
                image: DEFAULT_SEO.image,
                keywords: DEFAULT_SEO.keywords,
        }],
        ["/features", {
                title: "Features | Deal Scale",
                description:
                        "Check out powerful features of Deal Scale's AI, including automated lead nurturing, outreach, and our AI Caller.",
                canonical: "https://dealscale.io/features",
                image: "/banners/Feature.png",
                keywords: [...DEFAULT_SEO.keywords],
        }],
];

describe("Static SEO metadata", () => {
        it("provides entries for every expected static path", () => {
                cases.forEach(([path]) => {
                        expect(staticSeoMeta[path]).toBeDefined();
                });
        });

        it.each(cases)("matches configured metadata for %s", (path, expected) => {
                const seo = staticSeoMeta[path];
                expect(seo).toMatchObject(expected);
                expect(Array.isArray(seo.keywords)).toBe(true);
                expect(seo.image).toBe(expected.image);
                if (expected.priority !== undefined) {
                        expect(seo.priority).toBe(expected.priority);
                }
                if (expected.changeFrequency !== undefined) {
                        expect(seo.changeFrequency).toBe(expected.changeFrequency);
                }
        });
});
