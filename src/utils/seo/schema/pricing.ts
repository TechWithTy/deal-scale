import type {
	OneTimePlan,
	PricingCatalog,
	PricingCredits,
	PricingInterval,
	RecurringPlan,
	SeatAllocation,
	SelfHostedPlan,
	UnlimitedValue,
} from "@/types/service/plans";
import { buildProductSchema, buildServiceSchema } from "./builders";
import { buildAbsoluteUrl } from "./helpers";
import { DEFAULT_AVAILABILITY, DEFAULT_PRICE_CURRENCY } from "./transformers";
import type { ProductSchema, ServiceSchema } from "./types";

type BuildPricingJsonLdOptions = {
	catalog: PricingCatalog;
	canonicalUrl?: string;
};

const buildPlanDescription = (plan: RecurringPlan): string => {
	const featureSummary = plan.features?.slice(0, 4).join(" • ");
	const idealFor = plan.idealFor ? `Ideal for ${plan.idealFor}.` : "";
	const creditsSummary = buildCreditsSummary(plan.credits);
	const seatsSummary = buildSeatsSummary(plan.seats);

	return [featureSummary, idealFor, creditsSummary, seatsSummary]
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
	const isSelfHosted = isSelfHostedPlan(plan);
	const includeSummary = Array.isArray(plan.includes)
		? plan.includes.slice(0, 4).join(" • ")
		: "";
	const requirementsSummary = plan.requirements?.length
		? `Requirements: ${plan.requirements.slice(0, 3).join(" • ")}`
		: "";
	const aiCreditsSummary = isSelfHosted
		? `${plan.aiCredits.plan}, ${plan.aiCredits.description}`
		: "";
	const notesSummary =
		isSelfHosted && plan.notes?.length
			? plan.notes.slice(0, 2).join(" • ")
			: "";
	const idealFor = plan.idealFor ? `Ideal for ${plan.idealFor}.` : "";

	const descriptionParts = [
		plan.pricingModel,
		idealFor,
		includeSummary,
		aiCreditsSummary,
		notesSummary,
		requirementsSummary,
	]
		.filter((value) => value && value.trim().length > 0)
		.join(" ");

	return buildServiceSchema({
		name: plan.name,
		description: descriptionParts || plan.idealFor || plan.name,
		url: buildPlanUrl(plan.id, "one-time"),
		serviceType: isSelfHosted
			? "Self-Hosted Deployment"
			: "Channel Partnership",
		category: isSelfHosted ? "Enterprise Deployment" : "Partner Program",
		offers: {
			price: plan.pricingModel || "Contact for pricing",
			priceCurrency: DEFAULT_PRICE_CURRENCY,
			availability: "https://schema.org/PreOrder",
			url: isSelfHosted ? "/contact" : "/affiliate",
		},
	});
};

const formatUnlimitedValue = (value: UnlimitedValue | undefined): string => {
	if (value === undefined) {
		return "";
	}

	return typeof value === "number"
		? value.toLocaleString("en-US")
		: value === "unlimited"
			? "Unlimited"
			: String(value);
};

const buildCreditsSummary = (credits?: PricingCredits): string => {
	if (!credits) {
		return "";
	}

	const parts: string[] = [];

	if (credits.ai !== undefined) {
		parts.push(`${formatUnlimitedValue(credits.ai)} AI credits`);
	}

	if (credits.skipTrace !== undefined) {
		parts.push(`${formatUnlimitedValue(credits.skipTrace)} skip-trace lookups`);
	}

	if (credits.lead !== undefined) {
		parts.push(`${formatUnlimitedValue(credits.lead)} lead enrichments`);
	}

	return parts.length > 0 ? `Includes ${parts.join(", ")}.` : "";
};

const buildSeatsSummary = (seats?: SeatAllocation): string => {
	if (!seats) {
		return "";
	}

	if (typeof seats === "number") {
		return seats > 0
			? `${seats.toLocaleString("en-US")} seats included.`
			: "Seat-based access available.";
	}

	const included = formatUnlimitedValue(seats.included);
	const extras =
		typeof seats.additionalSeat === "number"
			? `Additional seats ${new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: DEFAULT_PRICE_CURRENCY,
					maximumFractionDigits: 0,
				}).format(seats.additionalSeat)}.`
			: "";

	return [`${included} seats included.`, extras].filter(Boolean).join(" ");
};

const isSelfHostedPlan = (plan: OneTimePlan): plan is SelfHostedPlan =>
	"roiEstimator" in plan;

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
