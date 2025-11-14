import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface AffiliatePartnerTeaserProps {
	commissionAmount?: string | null;
	onOpenTiers?: () => void;
}

export const AffiliatePartnerTeaser = ({
	commissionAmount,
	onOpenTiers,
}: AffiliatePartnerTeaserProps) => {
	return (
		<GlassCard className="relative mx-auto w-full max-w-5xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-background/80 to-background/95 p-8 shadow-xl sm:p-10">
			<div
				className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
				aria-hidden
			/>
			<div className="relative flex flex-col items-center gap-6 text-center">
				<Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
					Partner Circle Insider
				</Badge>
				<div className="space-y-3">
					<h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
						Turn your influence into a compounding revenue stream.
					</h3>
					<p className="text-sm text-muted-foreground sm:text-base">
						Coaches, masterminds, and community leaders convert AI wins into recurring income.
						Share a VIP link, unlock exclusive pricing, and earn up to
						<span className="font-semibold text-primary"> 50% recurring commission</span>
						{commissionAmount ? (
							<span className="ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400 sm:text-sm">
								≈ {commissionAmount}/mo
							</span>
						) : null}
						while DealScale automates onboarding, support, and reporting.
					</p>
				</div>
				<ul className="grid w-full gap-3 text-left text-sm text-muted-foreground sm:grid-cols-2">
					<li className="rounded-xl border border-border/60 bg-background/80 p-4">
						<p className="font-semibold text-foreground">Founding partner perks</p>
						<p className="mt-1 text-xs sm:text-sm">
							Locked-in pricing, roadmap access, and quarterly strategy labs.
						</p>
					</li>
					<li className="rounded-xl border border-border/60 bg-background/80 p-4">
						<p className="font-semibold text-foreground">VIP launch kits</p>
						<p className="mt-1 text-xs sm:text-sm">
							Done-for-you campaigns, swipe copy, and personal discount codes.
						</p>
					</li>
					<li className="rounded-xl border border-border/60 bg-background/80 p-4">
						<p className="font-semibold text-foreground">Leaderboard recognition</p>
						<p className="mt-1 text-xs sm:text-sm">
							Community shout-outs that drive even more conversions.
						</p>
					</li>
					<li className="rounded-xl border border-border/60 bg-background/80 p-4">
						<p className="font-semibold text-foreground">Zero tech lift</p>
						<p className="mt-1 text-xs sm:text-sm">
							We run onboarding, support, analytics, and payout ops.
						</p>
					</li>
				</ul>
				<p className="max-w-3xl text-xs text-muted-foreground sm:text-sm">
					Picture a student closing their first AI-assisted deal and thanking you on stage—while you collect every month they stay. That&apos;s the partnership we built for creators.
				</p>
				<div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
					<Button asChild className="w-full rounded-full sm:w-auto">
						<Link href="/affiliate">Apply to the Partner Circle</Link>
					</Button>
					<Button
						variant="outline"
						className="w-full rounded-full text-xs font-semibold sm:w-auto"
						onClick={onOpenTiers}
					>
						See commission tiers
					</Button>
				</div>
			</div>
		</GlassCard>
	);
};
