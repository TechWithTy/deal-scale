import { z } from "zod";

const schemaContext = z.literal("https://schema.org");

const contactPointSchema = z.object({
	"@type": z.literal("ContactPoint"),
	contactType: z.string(),
	telephone: z.string().optional(),
	email: z.string().optional(),
	areaServed: z.array(z.string()).optional(),
	availableLanguage: z.array(z.string()).optional(),
});

const postalAddressSchema = z.object({
	"@type": z.literal("PostalAddress"),
	streetAddress: z.string(),
	addressLocality: z.string().optional(),
	addressRegion: z.string().optional(),
	postalCode: z.string().optional(),
	addressCountry: z.string().optional(),
});

export const organizationSchema = z.object({
	"@context": schemaContext,
	"@type": z.literal("Organization"),
	"@id": z.string().min(1),
	name: z.string().min(1),
	legalName: z.string().min(1),
	url: z.string().url(),
	description: z.string().min(1),
	sameAs: z.array(z.string().url()),
	logo: z.string().url(),
	contactPoint: z.array(contactPointSchema).min(1),
	address: postalAddressSchema.optional(),
});

const searchActionSchema = z.object({
	"@type": z.literal("SearchAction"),
	target: z.string().min(1),
	"query-input": z.string().min(1),
});

export const websiteSchema = z.object({
	"@context": schemaContext,
	"@type": z.literal("WebSite"),
	"@id": z.string().min(1),
	url: z.string().url(),
	name: z.string().min(1),
	description: z.string().min(1),
	publisher: z.object({ "@id": z.string().min(1) }),
	potentialAction: searchActionSchema.optional(),
});

const offerSchema = z.object({
	"@type": z.literal("Offer"),
	price: z.union([z.number(), z.string().min(1)]),
	priceCurrency: z.string().min(1),
	availability: z.string().optional(),
	url: z.string().min(1).optional(),
	validFrom: z.string().optional(),
});

export const serviceSchema = z.object({
	"@context": schemaContext,
	"@type": z.literal("Service"),
	"@id": z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	url: z.string().url(),
	serviceType: z.string().min(1),
	category: z.string().optional(),
	areaServed: z.array(z.string()).optional(),
	provider: z.object({ "@id": z.string().min(1) }),
	offers: offerSchema.optional(),
});

export const productSchema = z.object({
	"@context": schemaContext,
	"@type": z.literal("Product"),
	"@id": z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	url: z.string().url(),
	sku: z.string().optional(),
	brand: z.object({
		"@type": z.literal("Brand"),
		name: z.string().min(1),
	}),
	image: z.array(z.string().min(1)).optional(),
	offers: offerSchema,
	manufacturer: z.object({ "@id": z.string().min(1) }).optional(),
	aggregateRating: z
		.object({
			"@type": z.literal("AggregateRating"),
			ratingValue: z.number(),
			reviewCount: z.number(),
		})
		.optional(),
});

export const schemaValidators = {
	organization: organizationSchema,
	website: websiteSchema,
	service: serviceSchema,
	product: productSchema,
};

export type OrganizationSchemaValidation = z.infer<typeof organizationSchema>;
export type WebSiteSchemaValidation = z.infer<typeof websiteSchema>;
export type ServiceSchemaValidation = z.infer<typeof serviceSchema>;
export type ProductSchemaValidation = z.infer<typeof productSchema>;

export function validateOrganizationSchema(
	payload: unknown,
): OrganizationSchemaValidation {
	return organizationSchema.parse(payload);
}

export function validateWebSiteSchema(
	payload: unknown,
): WebSiteSchemaValidation {
	return websiteSchema.parse(payload);
}

export function validateServiceSchema(
	payload: unknown,
): ServiceSchemaValidation {
	return serviceSchema.parse(payload);
}

export function validateProductSchema(
	payload: unknown,
): ProductSchemaValidation {
	return productSchema.parse(payload);
}
