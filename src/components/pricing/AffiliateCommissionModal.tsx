import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateCommissionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	topCommissionLabel?: string | null;
}

const TIERS: Array<{
	tier: string;
	label: string;
	commission: string;
	discount: string;
	burden: string;
	status: "safe" | "moderate" | "high" | "top";
	requirements: string[];
}> = [
	{
		tier: "Tier 1",
		label: "Starter Affiliate",
		commission: "10% recurring · 12 months",
		discount: "10% customer discount",
		burden: "Combined burden 20%",
		status: "safe",
		requirements: [
			"Approved application",
			"Complete onboarding",
			"Audience or niche alignment",
		],
	},
	{
		tier: "Tier 2",
		label: "Growth Partner",
		commission: "20% recurring · 24 months",
		discount: "10% customer discount",
		burden: "Combined burden 30%",
		status: "safe",
		requirements: [
			"10+ free-trial signups",
			"or 3+ paying users",
			"or $300+ Qualified Revenue",
		],
	},
	{
		tier: "Tier 3",
		label: "Pro Partner",
		commission: "30% recurring · lifetime",
		discount: "15% customer discount",
		burden: "Combined burden 45%",
		status: "moderate",
		requirements: [
			"10+ paying users",
			"or $1,500+ Qualified Revenue",
			"or consistent social promotion",
		],
	},
	{
		tier: "Tier 4",
		label: "Elite Partner",
		commission: "40% recurring · lifetime",
		discount: "15% customer discount",
		burden: "Combined burden 55%",
		status: "high",
		requirements: [
			"20+ paying users",
			"or $5,000+ Qualified Revenue",
			"or webinar / co-marketing collaboration",
		],
	},
	{
		tier: "Tier 5",
		label: "Strategic Partner",
		commission: "50% recurring · lifetime",
		discount: "20% customer discount",
		burden: "Combined burden 70% — reserved for strategic volume partners",
		status: "top",
		requirements: [
			"50+ paying users",
			"or $15,000+ Qualified Revenue",
			"or ongoing co-marketing partnership",
		],
	},
];

const StatusBadge = ({ status }: { status: typeof TIERS[number]["status"] }) => {
	switch (status) {
		case "safe":
			return (
				<Badge variant="outline" className="flex items-center justify-center border-emerald-400/40 bg-emerald-500/10 text-center text-emerald-300">
					Stable
				</Badge>
			);
		case "moderate":
			return (
				<Badge variant="outline" className="flex items-center justify-center border-amber-400/40 bg-amber-500/10 text-center text-amber-300">
					Momentum
				</Badge>
			);
		case "high":
			return (
				<Badge variant="outline" className="flex items-center justify-center border-yellow-400/40 bg-yellow-500/10 text-center text-yellow-300">
					High Reward
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="flex items-center justify-center border-primary/60 bg-primary/15 text-center text-primary">
					Strategic
				</Badge>
			);
	}
};

export const AffiliateCommissionModal = ({
	open,
	onOpenChange,
	topCommissionLabel,
}: AffiliateCommissionModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[min(100vw-1rem,64rem)] max-w-5xl overflow-hidden border border-primary/30 bg-gradient-to-b from-background/95 via-background to-background p-0 focus:outline-none sm:h-[85vh]">
				<Button
					variant="ghost"
					className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
					onClick={() => onOpenChange(false)}
				>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</Button>
				<div className="flex h-full max-h-[90vh] min-h-0 flex-col">
					<DialogHeader className="space-y-3 px-6 pt-6 text-left text-center sm:text-left">
						<DialogTitle className="text-2xl font-semibold text-foreground">
							Commission tiers & incentives
						</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Earn lifetime revenue share across five performance tiers with clear qualification rules and partner-friendly bonuses.
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className="flex-1 min-h-0">
						<div className="space-y-8 px-6 pb-6">
						<section className="space-y-3 text-center sm:text-left">
							<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
								Tier comparison
							</h3>
							<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:auto-rows-fr">
								{TIERS.map((tier) => (
									<div
										key={tier.tier}
										className={cn(
											"flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 text-left shadow-sm sm:grid sm:grid-cols-[minmax(0,12rem)_1fr]",
											tier.tier === "Tier 5" ? "md:col-span-2" : undefined,
										)}
									>
										<div className="flex flex-col gap-2 text-center sm:text-left">
											<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
												{tier.tier}
											</p>
											<span className="text-base font-semibold text-foreground">
												{tier.label}
											</span>
											<StatusBadge status={tier.status} />
										</div>
										<div className="space-y-2 text-sm text-muted-foreground text-center sm:text-left">
											<p>
												<strong className="text-foreground">Commission:</strong> {tier.commission}
											</p>
											<p>
												<strong className="text-foreground">Discount:</strong> {tier.discount}
											</p>
											<p>
												<strong className="text-foreground">Guidance:</strong> {tier.burden}
											</p>
											<ul className="grid gap-1 text-xs sm:text-sm">
												{tier.requirements.map((item) => (
													<li key={item} className="leading-relaxed text-muted-foreground/90">
														• {item}
													</li>
												))}
											</ul>
											{tier.status === "top" && topCommissionLabel ? (
												<p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300">
													≈ {topCommissionLabel} per Enterprise+ license
												</p>
											) : null}
										</div>
									</div>
								))}
							</div>
						</section>

						<Separator className="bg-border/50" />

						<section className="space-y-3 text-center sm:text-left">
							<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
								Incentives & bonuses
							</h3>
							<Accordion type="multiple" className="flex flex-col gap-3 text-left">
								<AccordionItem value="quarterly">
									<AccordionTrigger className="rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-left text-sm font-semibold text-foreground">
										Quarterly bonus pool
									</AccordionTrigger>
									<AccordionContent className="rounded-b-xl border border-t-0 border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
										Discretionary $5k+ rewards allocated to top performers based on revenue, retention, and compliance scores each quarter.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="fast-start">
									<AccordionTrigger className="rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-left text-sm font-semibold text-foreground">
										Fast start bonus
									</AccordionTrigger>
									<AccordionContent className="rounded-b-xl border border-t-0 border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
										Early activation multipliers or temporary tier boosts for new partners hitting conversion milestones within the first 60 days.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="mega-deal">
									<AccordionTrigger className="rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-left text-sm font-semibold text-foreground">
										Mega deal bonus
									</AccordionTrigger>
									<AccordionContent className="rounded-b-xl border border-t-0 border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
										One-off $1k–$5k cash awards for facilitating a single high-value conversion exceeding $25k in ACV.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="leaderboard">
									<AccordionTrigger className="rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-left text-sm font-semibold text-foreground">
										Leaderboard & retreats
									</AccordionTrigger>
									<AccordionContent className="rounded-b-xl border border-t-0 border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
										Public recognition, exclusive mastermind invitations, and VIP retreat access for top community contributors.
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</section>

						<Separator className="bg-border/50" />

						<section className="space-y-3 text-center text-sm text-muted-foreground sm:text-left">
							<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
								Program guardrails
							</h3>
							<ul className="list-disc space-y-1 pl-5 text-left">
								<li>Commission paid monthly after a 30-day validation window · $50 minimum payout.</li>
								<li>Tracking priority: affiliate link → discount code → server logs → manual reconciliation.</li>
								<li>No coupon sites, brand PPC bidding, spam outreach, or fraudulent trials.</li>
								<li>Full compliance with FTC endorsement guides, CAN-SPAM, and privacy laws (CCPA, GDPR).</li>
							</ul>
							<p className="text-center sm:text-left">
								Review the full legal terms before applying. Continued participation confirms acceptance.
							</p>
							<div className="flex justify-center">
								<Link
									href="https://garnet-pantry-446.notion.site/PUBLIC-Terms-and-Conditions-2aae9c25ecb0807dad32dc998500bd90?source=copy_link"
									target="_blank"
									rel="noreferrer"
									className="text-xs font-semibold text-primary underline"
								>
									Affiliate program agreement (public)
								</Link>
							</div>
						</section>
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
};
