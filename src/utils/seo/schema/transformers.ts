import type { ProductType } from "@/types/products";
import type { ServiceItemData } from "@/types/service/services";
import { buildProductSchema, buildServiceSchema } from "./builders";
import { buildAbsoluteUrl } from "./helpers";
import type { OfferInput, ProductSchema, ServiceSchema } from "./types";

const DEFAULT_AREA_SERVED = ["United States"] as const;
export const DEFAULT_PRICE_CURRENCY = "USD";
export const DEFAULT_AVAILABILITY = "https://schema.org/InStock";
const DEFAULT_CONTACT_PATH = "/contact";

const resolveServiceOffer = (
	service: ServiceItemData,
): OfferInput | undefined => {
	const pricingOptions = service.slugDetails.pricing ?? [];
	const primaryPlan = pricingOptions.find((plan) => {
		const { monthly, oneTime, annual } = plan.price;

		return (
			(typeof monthly.amount === "number" && monthly.amount > 0) ||
			(typeof oneTime.amount === "number" && oneTime.amount > 0) ||
			(typeof oneTime.amount === "string" &&
				oneTime.amount.trim().length > 0) ||
			(typeof annual.amount === "number" && annual.amount > 0)
		);
	});

	if (!primaryPlan) {
		return undefined;
	}

	const pickPrice = (value: unknown): number | string | undefined => {
		if (typeof value === "number") {
			return value;
		}

		if (typeof value === "string" && value.trim().length > 0) {
			return value;
		}

		return undefined;
	};

	const price =
		pickPrice(primaryPlan.price.monthly.amount) ??
		pickPrice(primaryPlan.price.oneTime.amount) ??
		pickPrice(primaryPlan.price.annual.amount) ??
		"Contact for pricing";

	const primaryCta =
		primaryPlan.cta.type === "link" && primaryPlan.cta.href
			? primaryPlan.cta.href
			: undefined;

	const fallbackCta =
		service.slugDetails.copyright.ctaLink?.trim() || DEFAULT_CONTACT_PATH;

	return {
		price,
		priceCurrency: DEFAULT_PRICE_CURRENCY,
		availability: DEFAULT_AVAILABILITY,
		url: primaryCta ?? fallbackCta,
	};
};

export const buildServiceJsonLd = (service: ServiceItemData): ServiceSchema =>
	buildServiceSchema({
		name: service.title,
		description: service.description,
		url: buildAbsoluteUrl(`/features/${service.slugDetails.slug}`),
		serviceType: service.title,
		category: service.categories[0],
		areaServed: [...DEFAULT_AREA_SERVED],
		offers: resolveServiceOffer(service),
	});

export const buildProductJsonLd = (product: ProductType): ProductSchema => {
	const canonicalSlug = product.slug ?? product.sku;
	const productUrl = buildAbsoluteUrl(`/products/${canonicalSlug}`);

	return buildProductSchema({
		name: product.name,
		description: product.description,
		url: productUrl,
		sku: product.sku,
		image: product.images.length > 0 ? [...product.images] : undefined,
		offers: {
			price: product.price,
			priceCurrency: DEFAULT_PRICE_CURRENCY,
			availability: DEFAULT_AVAILABILITY,
			url: `/products/${canonicalSlug}`,
		},
	});
};

export const buildProductListJsonLd = (
	products: ProductType[],
): ProductSchema[] => products.map((product) => buildProductJsonLd(product));
