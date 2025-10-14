import {
        buildOrganizationSchema,
        buildProductSchema,
        buildServiceSchema,
        buildWebSiteSchema,
} from "@/utils/seo/schema";
import { defaultSeo } from "@/utils/seo/staticSeo";

describe("schema builders", () => {
        it("builds the organization schema", () => {
                expect(buildOrganizationSchema()).toMatchSnapshot();
        });

        it("builds the website schema", () => {
                expect(buildWebSiteSchema()).toMatchSnapshot();
        });

        it("builds a service schema", () => {
                const serviceSchema = buildServiceSchema({
                        name: "AI Appointment Setting",
                        description:
                                "Done-for-you lead qualification powered by Deal Scale's AI agents.",
                        url: `${defaultSeo.canonical}/services/ai-appointment-setting`,
                        serviceType: "Lead Generation",
                        category: "AI Services",
                });

                expect(serviceSchema).toMatchSnapshot();
        });

        it("builds a product schema", () => {
                const productSchema = buildProductSchema({
                        name: "AI Lead Nurture Toolkit",
                        description:
                                "A comprehensive toolkit for managing AI-assisted lead nurture workflows.",
                        url: `${defaultSeo.canonical}/products/ai-lead-nurture-toolkit`,
                        sku: "AI-LEAD-001",
                        offers: {
                                price: 199,
                                priceCurrency: "USD",
                        },
                });

                expect(productSchema).toMatchSnapshot();
        });
});
