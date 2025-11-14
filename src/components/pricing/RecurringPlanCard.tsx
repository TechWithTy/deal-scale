"use client";

import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

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
	badgeLabel?: string;
	badgeVariant?: "basic" | "starter" | "enterprise";
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
	badgeLabel,
	badgeVariant,
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

	const renderBadge = () => {
		if (badge) return badge;
		if (!badgeLabel) return null;

		const badgeClass =
			badgeVariant === "starter"
				? "bg-gradient-to-r from-orange-500/10 to-orange-500/20 text-orange-400"
				: badgeVariant === "enterprise"
					? "bg-gradient-to-r from-emerald-500/10 to-emerald-500/20 text-emerald-400"
					: "bg-gradient-to-r from-sky-500/10 to-sky-500/20 text-sky-400";

		return (
			<Badge className={badgeClass} variant="secondary">
				{badgeLabel}
			</Badge>
		);
	};

	return (
		<GlassCard
			className={cn(
				"flex flex-col justify-between p-6",
				plan.ctaType === "contactSales" ? "border-primary/40" : undefined,
			)}
			highlighted={plan.ctaType === "subscribe" && plan.price >= 5000}
		>
			<div className="space-y-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className={cn("text-sm", "text-muted-foreground", "uppercase")}>
							{view === "monthly" ? "Monthly Plan" : "Annual Plan"}
						</p>
						<h3 className={cn("mt-1", "text-2xl", "font-semibold")}>
							{plan.name}
						</h3>
					</div>
					{renderBadge()}
				</div>
				<div>
					<p className={cn("text-4xl", "font-bold")}>{priceLabel}</p>
					{plan.idealFor ? (
						<p className={cn("mt-1", "text-sm", "text-muted-foreground")}>
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
