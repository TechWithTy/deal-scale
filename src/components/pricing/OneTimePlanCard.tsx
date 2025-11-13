"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { PartnershipPlan } from "@/types/service/plans";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface BaseProps {
	title: string;
	description?: string;
	features: string[];
	onPrimary?: () => void;
	primaryLabel: string;
	badgeLabel?: string;
	badgeVariant?: "basic" | "starter" | "enterprise" | "partner";
	badge?: ReactNode;
}

interface SelfHostedProps extends BaseProps {
	variant: "selfHosted";
	onSecondary: () => void;
	secondaryLabel: string;
	summary: string[];
	requirements?: string[];
}

interface PartnershipProps extends BaseProps {
	variant?: "partnership";
	requirements?: string[];
	href?: string;
}

export type OneTimeCardProps = SelfHostedProps | PartnershipProps;

const List = ({ items }: { items: string[] }) => (
	<ul className="space-y-2 text-muted-foreground text-sm">
		{items.map((item) => (
			<li key={item} className="flex gap-2">
				<CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
				<span>{item}</span>
			</li>
		))}
	</ul>
);

const renderBadge = ({
	badge,
	badgeLabel,
	badgeVariant,
}: {
	badge?: ReactNode;
	badgeLabel?: string;
	badgeVariant?: "basic" | "starter" | "enterprise" | "partner";
}) => {
	if (badge) {
		return <div className="shrink-0">{badge}</div>;
	}
	if (!badgeLabel) {
		return null;
	}

	const badgeClass =
		badgeVariant === "starter"
			? "bg-gradient-to-r from-orange-500/10 to-orange-500/20 text-orange-400"
			: badgeVariant === "enterprise"
				? "bg-gradient-to-r from-emerald-500/10 to-emerald-500/20 text-emerald-400"
				: badgeVariant === "partner"
					? "bg-gradient-to-r from-purple-500/10 to-purple-500/20 text-purple-400"
					: "bg-gradient-to-r from-sky-500/10 to-sky-500/20 text-sky-400";

	return (
		<Badge className={badgeClass} variant="secondary">
			{badgeLabel}
		</Badge>
	);
};

export const SelfHostedCard = ({
	title,
	description,
	features,
	summary,
	onPrimary,
	primaryLabel,
	onSecondary,
	secondaryLabel,
	requirements,
	badge,
	badgeLabel,
	badgeVariant,
}: SelfHostedProps) => (
	<GlassCard highlighted>
		<div className="flex flex-col gap-6 p-6">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-primary/80 text-xs uppercase">
						Private Deployment
					</p>
					<h3 className="mt-1 font-semibold text-3xl text-foreground">
						{title}
					</h3>
					{description ? (
						<p className="mt-2 text-muted-foreground text-sm">{description}</p>
					) : null}
				</div>
				{renderBadge({ badge, badgeLabel, badgeVariant })}
			</div>
			<List items={features} />
			{requirements ? (
				<div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm">
					<p className="font-semibold text-foreground/80">Requirements</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						{requirements.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			) : null}
			<div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
				<p className="font-semibold text-primary">Projected ROI Highlights</p>
				<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
					{summary.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>
			<div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Button
					className="w-full justify-center"
					onClick={onPrimary}
					variant="default"
				>
					{primaryLabel}
				</Button>
				<Button
					className="w-full min-w-[12rem] justify-center whitespace-nowrap"
					onClick={onSecondary}
					variant="outline"
				>
					{secondaryLabel}
				</Button>
			</div>
		</div>
	</GlassCard>
);

export const PartnershipCard = ({
	title,
	description,
	features,
	requirements,
	onPrimary,
	primaryLabel,
	href,
	badge,
	badgeLabel,
	badgeVariant = "partner",
}: PartnershipProps) => (
	<GlassCard className="border-border">
		<div className="flex flex-col gap-6 p-6">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-primary/60 text-xs uppercase">Performance Model</p>
					<h3 className="mt-1 font-semibold text-2xl text-foreground">
						{title}
					</h3>
					{description ? (
						<p className="mt-2 text-muted-foreground text-sm">{description}</p>
					) : null}
				</div>
				{renderBadge({ badge, badgeLabel, badgeVariant })}
			</div>
			<List items={features} />
			{requirements ? (
				<div className="rounded-lg bg-muted/40 p-4 text-sm">
					<p className="font-semibold text-foreground/80">Requirements</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
						{requirements.map((req) => (
							<li key={req}>{req}</li>
						))}
					</ul>
				</div>
			) : null}
			<div className="mt-auto">
				{href ? (
					<Button asChild className="w-full" variant="secondary">
						<Link href={href}>{primaryLabel}</Link>
					</Button>
				) : (
					<Button className="w-full" onClick={onPrimary}>
						{primaryLabel}
					</Button>
				)}
			</div>
		</div>
	</GlassCard>
);

export const toPartnershipProps = (
	plan: PartnershipPlan,
): PartnershipProps => ({
	variant: "partnership",
	title: plan.name,
	description: plan.pricingModel,
	features: plan.includes,
	requirements: plan.requirements,
	primaryLabel: plan.ctaType === "apply" ? "Apply Now" : "Contact Sales",
	href: "/contact",
});
