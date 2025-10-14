import { companyData } from "@/data/company";
import { defaultSeo } from "@/utils/seo/staticSeo";

import {
        buildAbsoluteUrl,
        buildContactPoints,
        buildPostalAddress,
        buildSocialProfiles,
        ORGANIZATION_ID,
        SCHEMA_CONTEXT,
        WEBSITE_ID,
} from "./helpers";
import type {
        OfferSchema,
        ProductSchema,
        ProductSchemaInput,
        ServiceSchema,
        ServiceSchemaInput,
        WebSiteSchema,
        OrganizationSchema,
} from "./types";

export const buildOrganizationSchema = (): OrganizationSchema => ({
        "@context": SCHEMA_CONTEXT,
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: companyData.companyName,
        legalName: companyData.companyName,
        url: defaultSeo.canonical,
        description: companyData.companyDescription,
        sameAs: buildSocialProfiles(),
        logo: buildAbsoluteUrl(defaultSeo.image),
        contactPoint: buildContactPoints(),
        address: buildPostalAddress(),
});

export const buildWebSiteSchema = (): WebSiteSchema => ({
        "@context": SCHEMA_CONTEXT,
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: defaultSeo.canonical,
        name: defaultSeo.siteName,
        description: defaultSeo.description,
        publisher: {
                "@id": ORGANIZATION_ID,
        },
        potentialAction: {
                "@type": "SearchAction",
                target: `${defaultSeo.canonical}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
        },
});

const buildOfferSchema = (offer?: ServiceSchemaInput["offers"]): OfferSchema | undefined => {
        if (!offer) {
                return undefined;
        }

        return {
                ...offer,
                "@type": "Offer",
                url: offer.url ? buildAbsoluteUrl(offer.url) : offer.url,
        };
};

export const buildServiceSchema = (
        service: ServiceSchemaInput,
): ServiceSchema => ({
        "@context": SCHEMA_CONTEXT,
        "@type": "Service",
        "@id": `${service.url}#service`,
        name: service.name,
        description: service.description,
        url: service.url,
        serviceType: service.serviceType ?? service.name,
        category: service.category,
        areaServed: service.areaServed,
        provider: {
                "@id": ORGANIZATION_ID,
        },
        offers: buildOfferSchema(service.offers),
});

export const buildProductSchema = (
        product: ProductSchemaInput,
): ProductSchema => ({
        "@context": SCHEMA_CONTEXT,
        "@type": "Product",
        "@id": `${product.url}#product`,
        name: product.name,
        description: product.description,
        url: product.url,
        sku: product.sku,
        brand: {
                "@type": "Brand",
                name: product.brand ?? companyData.companyName,
        },
        image: Array.isArray(product.image)
                ? product.image.map(buildAbsoluteUrl)
                : product.image
                ? [buildAbsoluteUrl(product.image)]
                : undefined,
        offers: {
                ...product.offers,
                "@type": "Offer",
                url: product.offers.url
                        ? buildAbsoluteUrl(product.offers.url)
                        : product.offers.url,
        },
        manufacturer: {
                "@id": ORGANIZATION_ID,
        },
});
