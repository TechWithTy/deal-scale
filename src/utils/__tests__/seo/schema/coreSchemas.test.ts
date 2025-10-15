import { ORGANIZATION_ID } from "@/utils/seo/schema";
import {
        buildAbsoluteUrl,
        buildOrganizationSchema,
        buildProductSchema,
        buildServiceSchema,
        buildWebSiteSchema,
} from "@/utils/seo/schema";
import {
        organizationSchema as organizationSchemaValidator,
        productSchema as productSchemaValidator,
        serviceSchema as serviceSchemaValidator,
        websiteSchema as websiteSchemaValidator,
} from "@/utils/seo/schema/validation";
import { SERVICE_CATEGORIES } from "@/types/service/services";

describe("core schema builders", () => {
        it("builds an Organization schema with canonical company metadata", () => {
                const schema = buildOrganizationSchema();

                expect(organizationSchemaValidator.safeParse(schema).success).toBe(
                        true,
                );
                expect(schema).toMatchObject({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "@id": expect.stringContaining("#organization"),
                        url: expect.stringMatching(/^https?:\/\//),
                        logo: expect.stringMatching(/^https?:\/\//),
                        contactPoint: expect.arrayContaining([
                                expect.objectContaining({ "@type": "ContactPoint" }),
                        ]),
                });
        });

        it("builds a WebSite schema referencing the organization", () => {
                const schema = buildWebSiteSchema();

                expect(websiteSchemaValidator.safeParse(schema).success).toBe(true);
                expect(schema).toMatchObject({
                        "@type": "WebSite",
                        "@id": expect.stringContaining("#website"),
                        publisher: { "@id": ORGANIZATION_ID },
                        potentialAction: expect.objectContaining({
                                "@type": "SearchAction",
                        }),
                });
        });

        it("builds a Service schema with offers and provider", () => {
                const schema = buildServiceSchema({
                        name: "AI Lead Qualification",
                        description: "Qualify leads automatically using AI call flows.",
                        url: buildAbsoluteUrl("/features/ai-lead-qualification"),
                        serviceType: "Lead Qualification",
                        category: SERVICE_CATEGORIES.LEAD_GENERATION,
                        areaServed: ["United States"],
                        offers: {
                                price: 1999,
                                priceCurrency: "USD",
                                availability: "https://schema.org/InStock",
                                url: "/contact",
                        },
                });

                expect(serviceSchemaValidator.safeParse(schema).success).toBe(true);
                expect(schema).toMatchObject({
                        "@type": "Service",
                        "@id": expect.stringContaining("#service"),
                        provider: { "@id": ORGANIZATION_ID },
                        offers: expect.objectContaining({
                                "@type": "Offer",
                                price: 1999,
                                priceCurrency: "USD",
                                url: buildAbsoluteUrl("/contact"),
                        }),
                });
        });

        it("builds a Product schema with normalized assets", () => {
                const schema = buildProductSchema({
                        name: "Deal Scale CRM",
                        description: "AI-powered CRM built for real estate teams.",
                        url: buildAbsoluteUrl("/products/deal-scale-crm"),
                        sku: "DS-CRM-001",
                        image: ["/images/products/crm.png"],
                        offers: {
                                price: 149,
                                priceCurrency: "USD",
                                availability: "https://schema.org/InStock",
                                url: "/checkout",
                        },
                });

                expect(productSchemaValidator.safeParse(schema).success).toBe(true);
                expect(schema).toMatchObject({
                        "@type": "Product",
                        "@id": expect.stringContaining("#product"),
                        sku: "DS-CRM-001",
                        image: [buildAbsoluteUrl("/images/products/crm.png")],
                        offers: expect.objectContaining({
                                url: buildAbsoluteUrl("/checkout"),
                        }),
                });
        });
});
