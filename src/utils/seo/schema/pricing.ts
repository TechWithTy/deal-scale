import type {
	OneTimePlan,
	PricingCatalog,
	PricingInterval,
	RecurringPlan,
} from "@/types/service/plans";
import { buildProductSchema, buildServiceSchema } from "./builders";
import { buildAbsoluteUrl } from "./helpers";
import {
	DEFAULT_AVAILABILITY,
	DEFAULT_PRICE_CURRENCY,
} from "./transformers";
import type { ProductSchema, ServiceSchema } from "./types";

type BuildPricingJsonLdOptions = {
	catalog: PricingCatalog;
	canonicalUrl?: string;
};

const buildPlanDescription = (plan: RecurringPlan): string => {
	const featureSummary = plan.features?.slice(0, 4).join(" • ");
	const idealFor = plan.idealFor ? `Ideal for ${plan.idealFor}.` : "";

	return [featureSummary, idealFor]
		.filter((value) => value && value.trim().length > 0)
		.join(" ")
		.trim();
};

const buildPlanUrl = (planId: string, interval: string): string =>
	buildAbsoluteUrl(`/pricing?plan=${planId}&interval=${interval}`);

const toSku = (planId: string, interval: PricingInterval | "one-time") =>
	`${planId}-${interval}`.toUpperCase();

const buildRecurringPlanProduct = (
	plan: RecurringPlan,
	interval: PricingInterval,
): ProductSchema =>
	buildProductSchema({
		name: `${plan.name} (${interval === "monthly" ? "Monthly" : "Annual"})`,
		description: buildPlanDescription(plan),
		url: buildPlanUrl(plan.id, interval),
		sku: toSku(plan.id, interval),
		offers: {
			price: plan.price,
			priceCurrency: DEFAULT_PRICE_CURRENCY,
			availability: DEFAULT_AVAILABILITY,
			url: `/pricing?plan=${plan.id}&interval=${interval}`,
		},
	});

const buildOneTimePlanService = (plan: OneTimePlan): ServiceSchema => {
	const descriptionParts = [
		plan.pricingModel,
		Array.isArray(plan.includes) ? plan.includes.slice(0, 4).join(" • ") : "",
	]
		.filter((value) => value && value.trim().length > 0)
		.join(" ");

	return buildServiceSchema({
		name: plan.name,
		description: descriptionParts || plan.idealFor || plan.name,
		url: buildPlanUrl(plan.id, "one-time"),
		serviceType: "One-Time Pricing",
		category: "Enterprise Deployment",
		offers: plan.pricingModel
			? {
					price: plan.pricingModel,
					priceCurrency: DEFAULT_PRICE_CURRENCY,
					availability: "https://schema.org/PreOrder",
					url: "/contact",
				}
			: undefined,
	});
};

export const buildPricingJsonLd = ({
	catalog,
}: BuildPricingJsonLdOptions): Array<ProductSchema | ServiceSchema> => {
	const monthlyPlans = catalog.pricing.monthly.map((plan) =>
		buildRecurringPlanProduct(plan, "monthly"),
	);
	const annualPlans = catalog.pricing.annual.map((plan) =>
		buildRecurringPlanProduct(plan, "annual"),
	);
	const oneTimePlans = catalog.pricing.oneTime.map((plan) =>
		buildOneTimePlanService(plan),
	);

	return [...monthlyPlans, ...annualPlans, ...oneTimePlans];
};

