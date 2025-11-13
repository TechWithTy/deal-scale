"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type {
	PricingInterval,
	RecurringPlan,
	SeatAllocation,
	UnlimitedValue,
} from "@/types/service/plans";
import { Check, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export interface RecurringPlanCardProps {
	plan: RecurringPlan;
	view: PricingInterval;
	onSubscribe?: () => void;
	loading?: boolean;
	ctaOverride?: {
		label: string;
		href?: string;
		onClick?: () => void;
	};
	badge?: ReactNode;
}

const formatCurrency = (amount: number) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);

const formatSeatAllocation = (seats?: SeatAllocation) => {
	if (!seats) return null;
	if (typeof seats === "number") {
		return `${seats} seat${seats === 1 ? "" : "s"}`;
	}
	const { included, additionalSeat } = seats;
	const includedLabel =
		typeof included === "number" ? `${included}` : included.toString();
	const seatLabel =
		additionalSeat && additionalSeat > 0
			? `, $${additionalSeat}/mo per additional seat`
			: "";
	return `${includedLabel} seats${seatLabel}`;
};

const formatCredits = (value?: UnlimitedValue) => {
	if (value === undefined) return null;
	if (value === "unlimited") return "Unlimited";
	return new Intl.NumberFormat("en-US").format(value);
};

export const RecurringPlanCard = ({
	plan,
	view,
	onSubscribe,
	loading,
	ctaOverride,
	badge,
}: RecurringPlanCardProps) => {
	const priceLabel =
		view === "monthly"
			? `${formatCurrency(plan.price)}/mo`
			: `${formatCurrency(plan.price)}/yr`;

	const credits = plan.credits
		? [
				{ label: "AI", value: formatCredits(plan.credits.ai) },
				{ label: "Skip Trace", value: formatCredits(plan.credits.skipTrace) },
				{ label: "Lead", value: formatCredits(plan.credits.lead) },
			].filter((credit) => credit.value)
		: [];

	const seats = formatSeatAllocation(plan.seats);

	const handleSubscribe = () => {
		if (loading) return;
		onSubscribe?.();
	};

	const ctaLabel =
		ctaOverride?.label ??
		(plan.ctaType === "subscribe"
			? `Choose ${plan.name}`
			: plan.ctaType === "contactSales"
				? "Contact Sales"
				: plan.ctaType === "upgrade"
					? "Start Free Trial"
					: "Learn More");

	const actionButton =
		ctaOverride?.href || plan.ctaType === "contactSales" ? (
			<Button
				asChild
				className="mt-4 w-full"
				variant={plan.ctaType === "contactSales" ? "secondary" : "default"}
			>
				<Link href={ctaOverride?.href ?? "/contact"}>{ctaLabel}</Link>
			</Button>
		) : (
			<Button
				className="mt-4 w-full"
				onClick={ctaOverride?.onClick ?? handleSubscribe}
				disabled={loading}
			>
				{loading ? "Processing..." : ctaLabel}
			</Button>
		);

	return (
		<GlassCard
			className={`flex flex-col justify-between p-6 ${
				plan.ctaType === "contactSales" ? "border-primary/40" : ""
			}`}
			highlighted={plan.ctaType === "subscribe" && plan.price >= 5000}
		>
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="text-muted-foreground text-sm uppercase">
							{view === "monthly" ? "Monthly Plan" : "Annual Plan"}
						</p>
						<h3 className="mt-1 font-semibold text-2xl">{plan.name}</h3>
					</div>
					{badge}
				</div>
				<div>
					<p className="font-bold text-4xl">{priceLabel}</p>
					{plan.idealFor ? (
						<p className="mt-1 text-muted-foreground text-sm">
							Ideal for {plan.idealFor.toLowerCase()}
						</p>
					) : null}
				</div>
				<ul className="space-y-3">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-start gap-2 text-sm">
							<span className="mt-0.5 rounded-full bg-primary/10 p-1">
								<Check className="h-3 w-3 text-primary" />
							</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
				{(credits.length > 0 || seats) && (
					<div className="rounded-lg bg-muted/30 p-4 text-sm">
						<div className="flex items-center gap-2 font-medium">
							<Users className="h-4 w-4" />
							Inclusions
						</div>
						<div className="mt-2 grid grid-cols-1 gap-2 text-muted-foreground sm:grid-cols-2">
							{credits.map((credit) => (
								<div key={credit.label}>
									<span className="font-semibold">{credit.value}</span>{" "}
									{credit.label} credits
								</div>
							))}
							{seats ? <div>{seats}</div> : null}
						</div>
					</div>
				)}
			</div>
			<div className="mt-4">{actionButton}</div>
		</GlassCard>
	);
};
