export type SchemaContext = "https://schema.org";

export type ContactPointSchema = {
        "@type": "ContactPoint";
        contactType: string;
        telephone?: string;
        email?: string;
        areaServed?: string[];
        availableLanguage?: string[];
};

export type PostalAddressSchema = {
        "@type": "PostalAddress";
        streetAddress: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
};

export type OfferInput = {
        price: number | string;
        priceCurrency: string;
        availability?: string;
        url?: string;
        validFrom?: string;
};

export type OfferSchema = OfferInput & {
        "@type": "Offer";
};

export type OrganizationSchema = {
        "@context": SchemaContext;
        "@type": "Organization";
        "@id": string;
        name: string;
        legalName: string;
        url: string;
        description: string;
        sameAs: string[];
        logo: string;
        contactPoint: ContactPointSchema[];
        address?: PostalAddressSchema;
};

export type WebSiteSchema = {
        "@context": SchemaContext;
        "@type": "WebSite";
        "@id": string;
        url: string;
        name: string;
        description: string;
        publisher: {
                "@id": string;
        };
        potentialAction?: {
                "@type": "SearchAction";
                target: string;
                "query-input": string;
        };
};

export type ServiceSchemaInput = {
        name: string;
        description: string;
        url: string;
        serviceType?: string;
        category?: string;
        areaServed?: string[];
        offers?: OfferInput;
};

export type ServiceSchema = {
        "@context": SchemaContext;
        "@type": "Service";
        "@id": string;
        name: string;
        description: string;
        url: string;
        serviceType: string;
        category?: string;
        areaServed?: string[];
        provider: {
                "@id": string;
        };
        offers?: OfferSchema;
};

export type ProductSchemaInput = {
        name: string;
        description: string;
        url: string;
        sku?: string;
        brand?: string;
        image?: string | string[];
        offers: OfferInput;
};

export type ProductSchema = {
        "@context": SchemaContext;
        "@type": "Product";
        "@id": string;
        name: string;
        description: string;
        url: string;
        sku?: string;
        brand: {
                "@type": "Brand";
                name: string;
        };
        image?: string[];
        offers: OfferSchema;
        manufacturer?: {
                "@id": string;
        };
        aggregateRating?: {
                "@type": "AggregateRating";
                ratingValue: number;
                reviewCount: number;
        };
};
