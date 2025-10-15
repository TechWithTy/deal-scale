import {
        buildAbsoluteUrl,
        buildProductJsonLd,
        buildProductListJsonLd,
        buildServiceJsonLd,
} from "@/utils/seo/schema";
import {
        productSchema as productSchemaValidator,
        serviceSchema as serviceSchemaValidator,
} from "@/utils/seo/schema/validation";
import { ProductCategory } from "@/types/products";
import type { ProductType } from "@/types/products";
import { SERVICE_CATEGORIES } from "@/types/service/services";
import type { ServiceItemData } from "@/types/service/services";
import type { Plan } from "@/types/service/plans";

describe("domain schema transformers", () => {
        const buildPricingPlan = (): Plan => ({
                id: "ai-plan",
                name: "AI Growth",
                price: {
                        monthly: {
                                amount: 1200,
                                description: "per month",
                                features: ["AI call coverage"],
                        },
                        annual: {
                                amount: 12000,
                                description: "per year",
                                features: ["AI call coverage"],
                        },
                        oneTime: {
                                amount: 0,
                                description: "",
                                features: [],
                        },
                },
                cta: {
                        text: "Talk to Sales",
                        type: "link",
                        href: "/contact",
                },
        });

        const buildService = (): ServiceItemData => ({
                id: "ai-call-assistant",
                iconName: "Phone",
                title: "AI Call Assistant",
                description: "AI agents that nurture and qualify real estate leads.",
                features: ["24/7 lead coverage"],
                price: "Subscription",
                categories: [
                        SERVICE_CATEGORIES.AI_FEATURES,
                        SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
                ],
                slugDetails: {
                        slug: "ai-call-assistant",
                        dilemma:
                                "Manual lead follow-up leaves opportunities on the table.",
                        solution:
                                "Deploy AI callers that convert more leads without hiring costs.",
                        pricing: [buildPricingPlan()],
                        faq: {
                                title: "AI Caller FAQs",
                                subtitle: "Answers about our AI agents",
                                faqItems: [
                                        {
                                                question: "How quickly can we launch?",
                                                answer: "Launch within 48 hours with our onboarding team.",
                                        },
                                ],
                        },
                        defaultZoom: 1,
                        problemsAndSolutions: [
                                {
                                        problem: "Leads go unanswered overnight.",
                                        solution: "AI agents respond instantly and qualify prospects.",
                                },
                        ],
                        howItWorks: [
                                {
                                        stepNumber: 1,
                                        title: "Connect",
                                        subtitle: "Sync your leads",
                                        description: "We integrate with your CRM in minutes.",
                                        icon: "Phone",
                                        label: "Sync",
                                        positionLabel: "start",
                                        payload: [],
                                },
                        ],
                        testimonials: [
                                {
                                        id: 1,
                                        name: "Jamie Rivera",
                                        role: "Broker",
                                        content: "Our pipeline tripled with AI callers.",
                                        problem: "Could not follow up fast enough.",
                                        solution: "Automated nurtures keep leads warm.",
                                        rating: 5,
                                        company: "Atlas Realty",
                                },
                        ],
                        integrations: [
                                {
                                        category: "CRM",
                                        libraries: [
                                                {
                                                        name: "HubSpot",
                                                        description: "HubSpot CRM integration",
                                                },
                                        ],
                                },
                        ],
                        copyright: {
                                title: "Ready to scale conversations?",
                                subtitle: "Let AI book your next appointment.",
                                ctaText: "Get Started",
                                ctaLink: "/contact",
                        },
                },
        });

        const buildProduct = (): ProductType => ({
                id: "prod-ai-playbook",
                name: "AI Playbook",
                description: "Step-by-step AI outreach workflows for acquisitions teams.",
                price: 149,
                sku: "DS-AI-PLAYBOOK",
                slug: "ai-playbook",
                images: ["/images/products/ai-playbook.png"],
                reviews: [
                        {
                                id: 1,
                                author: "Jordan Sparks",
                                rating: 5,
                                date: "2024-01-01",
                                content: "Actionable flows that boosted our conversions.",
                        },
                ],
                categories: [ProductCategory.Automation],
                types: [{ name: "Standard", value: "standard", price: 149 }],
                colors: [
                        {
                                name: "Midnight",
                                value: "#000000",
                                class: "bg-black",
                        },
                ],
                sizes: [
                        {
                                name: "One Size",
                                value: "one-size",
                                inStock: true,
                        },
                ],
        });

        it("transforms a ServiceItemData entity into a Service schema", () => {
                const service = buildService();

                const schema = buildServiceJsonLd(service);

                expect(serviceSchemaValidator.safeParse(schema).success).toBe(true);
                expect(schema).toMatchObject({
                        name: service.title,
                        url: buildAbsoluteUrl(`/features/${service.slugDetails.slug}`),
                        offers: expect.objectContaining({
                                priceCurrency: "USD",
                        }),
                });
        });

        it("transforms a ProductType entity into a Product schema", () => {
                const product = buildProduct();

                const schema = buildProductJsonLd(product);

                expect(productSchemaValidator.safeParse(schema).success).toBe(true);
                expect(schema).toMatchObject({
                        name: product.name,
                        sku: product.sku,
                        url: buildAbsoluteUrl(`/products/${product.slug}`),
                });
        });

        it("transforms a product collection into JSON-LD graph", () => {
                const product = buildProduct();

                const graph = buildProductListJsonLd([product]);

                expect(Array.isArray(graph)).toBe(true);
                expect(graph).toHaveLength(1);
                expect(productSchemaValidator.safeParse(graph[0]).success).toBe(true);
        });
});
