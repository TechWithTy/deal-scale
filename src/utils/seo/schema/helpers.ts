import { companyData } from "@/data/company";
import { defaultSeo } from "@/utils/seo/staticSeo";

import type {
        ContactPointSchema,
        PostalAddressSchema,
        SchemaContext,
} from "./types";

export const SCHEMA_CONTEXT: SchemaContext = "https://schema.org";
export const ORGANIZATION_ID = `${defaultSeo.canonical}#organization`;
export const WEBSITE_ID = `${defaultSeo.canonical}#website`;

export const buildAbsoluteUrl = (pathOrUrl: string): string => {
        if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
                return pathOrUrl;
        }

        return `${defaultSeo.canonical}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

export const buildSocialProfiles = (): string[] => {
        const { socialLinks } = companyData;
        const socialUrls = [
                socialLinks.linkedin,
                socialLinks.facebook,
                socialLinks.instagram,
                socialLinks.mediumUsername
                        ? `https://medium.com/@${socialLinks.mediumUsername}`
                        : undefined,
        ].filter((link): link is string => Boolean(link));

        return socialUrls;
};

export const buildContactPoints = (): ContactPointSchema[] => {
        const points: ContactPointSchema[] = [];

        if (companyData.contactInfo.phone) {
                points.push({
                        "@type": "ContactPoint",
                        contactType: "customer service",
                        telephone: companyData.contactInfo.phone,
                        availableLanguage: ["en"],
                });
        }

        if (companyData.contactInfo.email) {
                points.push({
                        "@type": "ContactPoint",
                        contactType: "sales",
                        email: companyData.contactInfo.email,
                        availableLanguage: ["en"],
                });
        }

        return points;
};

export const buildPostalAddress = (): PostalAddressSchema | undefined => {
        const address = companyData.contactInfo.address?.trim();

        if (!address) {
                return undefined;
        }

        const [street = "", localityLine = ""] = address.split("\n");
        const [addressLocality, addressRegion] = localityLine
                .split(",")
                .map((segment) => segment.trim());

        return {
                "@type": "PostalAddress",
                streetAddress: street,
                addressLocality,
                addressRegion,
        };
};
