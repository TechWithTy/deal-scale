import type { Plan, PlanType } from "@/types/service/plans";
import type { AnnualDiscountSummary } from "./PlanTypeToggle";

export const PLAN_TYPES: PlanType[] = ["monthly", "annual", "oneTime"];

type PlanPricing = Plan["price"][PlanType];

export function hasDisplayablePricing(price: PlanPricing | undefined) {
	if (!price) {
		return false;
	}

	if (price.features.length > 0) {
		return true;
	}

	const { amount } = price;

	if (typeof amount === "string") {
		return amount.trim().length > 0;
	}

	return Number.isFinite(amount) && amount > 0;
}

export function computeAnnualDiscountSummary(
	plans: Plan[],
): AnnualDiscountSummary | undefined {
	let percent: number | undefined;
	let amount: number | undefined;

	for (const plan of plans) {
		const discount = plan.price.annual?.discount?.code;
		if (!discount) {
			continue;
		}

		if (typeof discount.discountPercent === "number") {
			percent = Math.max(percent ?? 0, discount.discountPercent);
		}

		if (typeof discount.discountAmount === "number") {
			amount = Math.max(amount ?? 0, discount.discountAmount);
		}
	}

	if (!percent && !amount) {
		return undefined;
	}

	return { percent, amount };
}
