"use client";

import { ProductCheckoutForm } from "@/components/checkout/product/ProductCheckoutForm";
import PricingCheckoutDialog from "@/components/home/pricing/PricingCheckoutDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardStack } from "@/components/ui/card-stack";
import { GlassCard } from "@/components/ui/glass-card";
import { ProductSelectionProvider } from "@/contexts/ProductSelectionContext";
import { mockDiscountCodes } from "@/data/discount/mockDiscountCodes";
import { creditProducts } from "@/data/products/credits";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { useWaitCursor } from "@/hooks/useWaitCursor";
import { startStripeToast } from "@/lib/ui/stripeToast";
import { cn } from "@/lib/utils";
import type { DiscountCode } from "@/types/discount/discountCode";
import type {
	OneTimePlan,
	Plan,
	PricingCatalog,
	PricingInterval,
	RecurringPlan,
	SelfHostedPlan,
} from "@/types/service/plans";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import toast from "react-hot-toast";
import {
	PartnershipCard,
	SelfHostedCard,
	toPartnershipProps,
} from "./OneTimePlanCard";
import { RecurringPlanCard } from "./RecurringPlanCard";
import { RoiEstimatorModal } from "./RoiEstimatorModal";
import { AffiliatePartnerTeaser } from "./AffiliatePartnerTeaser";
import { AffiliateCommissionModal } from "./AffiliateCommissionModal";

type PricingView = PricingInterval | "oneTime";

const VIEW_OPTIONS: Array<{ value: PricingView; label: string }> = [
	{ value: "monthly", label: "Monthly" },
	{ value: "annual", label: "Annual" },
	{ value: "oneTime", label: "One-Time" },
];

const ANNUAL_PLAN_BADGES: Record<
	string,
	{ label: string; variant: "basic" | "starter" | "enterprise" }
> = {
	basicAnnual: { label: "Basic Annual", variant: "basic" },
	starterAnnual: { label: "Starter Annual", variant: "starter" },
	enterpriseAnnual: { label: "Enterprise Annual", variant: "enterprise" },
};

const MONTHLY_PLAN_BADGES: Record<
	string,
	{ label: string; variant: "basic" | "starter" | "enterprise" }
> = {
	basic: { label: "Basic Monthly", variant: "basic" },
	starter: { label: "Starter Monthly", variant: "starter" },
	enterprisePlus: { label: "Enterprise+ Monthly", variant: "enterprise" },
};

const ONE_TIME_PLAN_BADGES: Record<
	string,
	{ label: string; variant: "partner" | "basic" | "starter" | "enterprise" }
> = {
	commissionPartner: { label: "Commission Partner", variant: "partner" },
};

const FREE_TRIAL_EXP_KEY = "dealscale:pricing:beta-expiry";
const DEFAULT_COUNTDOWN_MS = 72 * 60 * 60 * 1000; // 72 hours

const toLegacyPlan = (
	plan: RecurringPlan,
	interval: PricingInterval,
): Plan => ({
	id: `${plan.id}-${interval}`,
	name: plan.name,
	price: {
		monthly: {
			amount: interval === "monthly" ? plan.price : 0,
			description: interval === "monthly" ? "per month" : "",
			features: interval === "monthly" ? plan.features : [],
		},
		annual: {
			amount: interval === "annual" ? plan.price : 0,
			description: interval === "annual" ? "per year" : "",
			features: interval === "annual" ? plan.features : [],
		},
		oneTime: { amount: 0, description: "", features: [] },
	},
	cta: { text: "Complete Checkout", type: "checkout" },
});

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	: null;

const isSelfHosted = (plan: OneTimePlan): plan is SelfHostedPlan =>
	"ctaPrimary" in plan && "roiEstimator" in plan;

/**
 * CatalogPricing renders the pricing catalog with optional teaser sections.
 * Pass the boolean flags below to hide any promotional content when embedding
 * the pricing grid in other contexts (e.g. blog posts or feature pages).
 *
 * Example minimal usage:
 * ```tsx
 * <CatalogPricing
 *   title="Pricing"
 *   subtitle="Choose the plan that fits"
 *   catalog={pricingCatalog}
 *   {...minimalCatalogPricingOptions}
 * />
 * ```
 */
interface CatalogPricingProps {
	title: string;
	subtitle: string;
	catalog: PricingCatalog;
	callbackUrl?: string;
	showFreePreview?: boolean;
	showUpgradeStack?: boolean;
	showAddOnStack?: boolean;
	showPilotBlurb?: boolean;
}

export const minimalCatalogPricingOptions = {
	showFreePreview: false,
	showUpgradeStack: false,
	showAddOnStack: false,
	showPilotBlurb: false,
} as const;

export const CatalogPricing = ({
	title,
	subtitle,
	catalog,
	callbackUrl,
	showFreePreview = true,
	showUpgradeStack = true,
	showAddOnStack = true,
	showPilotBlurb = true,
}: CatalogPricingProps) => {
	const router = useNavigationRouter();
	const [view, setView] = useState<PricingView>("monthly");
	const [loading, setLoading] = useState<string | null>(null);
	const [checkoutState, setCheckoutState] = useState<{
		plan: Plan;
		view: PricingInterval;
		clientSecret: string;
		mode: "payment" | "setup";
		context: "standard" | "trial";
		postTrialAmount?: number;
	} | null>(null);
	const [roiOpen, setRoiOpen] = useState(false);
	const [countdown, setCountdown] = useState<string>("");
	const [productCheckoutSecret, setProductCheckoutSecret] = useState<
		string | null
	>(null);
	const [productCheckoutCoupon, setProductCheckoutCoupon] = useState<
		string | null
	>(null);
	const [productCheckoutDiscount, setProductCheckoutDiscount] =
		useState<DiscountCode | null>(null);
	const [productCheckoutLoading, setProductCheckoutLoading] = useState(false);
	const [trialLoading, setTrialLoading] = useState(false);
	const [affiliateModalOpen, setAffiliateModalOpen] = useState(false);

	useWaitCursor(productCheckoutLoading || trialLoading);

	const availableViews = useMemo(
		() =>
			VIEW_OPTIONS.filter(({ value }) => {
				if (value === "oneTime") {
					return catalog.pricing.oneTime.length > 0;
				}
				return catalog.pricing[value].length > 0;
			}).map((option) => option.value),
		[catalog],
	);

	useEffect(() => {
		if (!availableViews.includes(view) && availableViews.length > 0) {
			setView(availableViews[0]);
		}
	}, [availableViews, view]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const storedExpiry = window.localStorage.getItem(FREE_TRIAL_EXP_KEY);
		let expiry = storedExpiry ? Number.parseInt(storedExpiry, 10) : Number.NaN;

		if (Number.isNaN(expiry) || expiry <= Date.now()) {
			expiry = Date.now() + DEFAULT_COUNTDOWN_MS;
			window.localStorage.setItem(FREE_TRIAL_EXP_KEY, expiry.toString());
		}

		const updateCountdown = () => {
			const diff = Math.max(0, expiry - Date.now());
			if (diff <= 0) {
				setCountdown("00:00:00");
				return;
			}

			const totalSeconds = Math.floor(diff / 1000);
			const hours = Math.floor(totalSeconds / 3600)
				.toString()
				.padStart(2, "0");
			const minutes = Math.floor((totalSeconds % 3600) / 60)
				.toString()
				.padStart(2, "0");
			const seconds = Math.floor(totalSeconds % 60)
				.toString()
				.padStart(2, "0");

			setCountdown(`${hours}:${minutes}:${seconds}`);
		};

		updateCountdown();
		const intervalId = window.setInterval(updateCountdown, 1000);

		return () => window.clearInterval(intervalId);
	}, []);

	const monthlyPlans = catalog.pricing.monthly;
	const annualPlans = catalog.pricing.annual;
	const oneTimePlans = catalog.pricing.oneTime;

	const recurringPlans =
		view === "monthly"
			? monthlyPlans.filter((plan) => plan.id !== "free")
			: view === "annual"
				? annualPlans
				: [];

	const selfHostedPlan = oneTimePlans.find(
		(plan): plan is SelfHostedPlan => "roiEstimator" in plan,
	);
	const partnershipPlans = oneTimePlans.filter(
		(plan): plan is Exclude<OneTimePlan, SelfHostedPlan> =>
			!("roiEstimator" in plan),
	);

	const handleSubscribe = useCallback(
		async (recurringPlan: RecurringPlan, interval: PricingInterval) => {
			try {
				setLoading(`${recurringPlan.id}-${interval}`);

				const amountInCents = Math.round(recurringPlan.price * 100);
				if (amountInCents <= 0) {
					toast.error(
						"This plan cannot be purchased online. Contact our team.",
					);
					return false;
				}

				const response = await fetch("/api/stripe/intent", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						price: amountInCents,
						description: `${recurringPlan.name} subscription (${interval})`,
						metadata: {
							planId: recurringPlan.id,
							planName: recurringPlan.name,
							planType: interval,
							callbackUrl,
						},
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || "Failed to create payment intent");
				}

				const { clientSecret } = (await response.json()) as {
					clientSecret?: string;
				};

				if (!clientSecret) {
					throw new Error("Missing payment intent secret");
				}

				setCheckoutState({
					clientSecret,
					view: interval,
					plan: toLegacyPlan(recurringPlan, interval),
					mode: "payment",
					context: "standard",
				});

				return true;
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Unable to start checkout",
				);
				return false;
			} finally {
				setLoading(null);
			}
		},
		[callbackUrl],
	);

	const handleViewChange = (next: PricingView) => {
		setView(next);
	};

	const freePlan = monthlyPlans.find((plan) => plan.id === "free");
	const basicPlan = monthlyPlans.find((plan) => plan.id === "basic");
	const starterPlan = monthlyPlans.find((plan) => plan.id === "starter");

	const aiCreditsProduct = useMemo(
		() =>
			creditProducts.find(
				(product) => product.slug === "ai-conversation-credits",
			),
		[],
	);

	const handleProductCheckout = useCallback(
		async (coupon: string) => {
			if (!aiCreditsProduct) {
				toast.error(
					"AI credits product is unavailable. Please try again later.",
				);
				return;
			}

			if (!stripePromise) {
				toast.error("Checkout is unavailable right now.");
				return;
			}

			setProductCheckoutLoading(true);
			const normalizedCoupon = coupon.toUpperCase();
			setProductCheckoutCoupon(normalizedCoupon);
			setProductCheckoutDiscount(
				mockDiscountCodes.find(
					(dc) => dc.code.toUpperCase() === normalizedCoupon,
				) ?? null,
			);
			const stripeToast = startStripeToast("Preparing Stripe checkout…");

			try {
				await navigator.clipboard.writeText(coupon);
				toast.success("Coupon copied to clipboard");
			} catch (error) {
				console.error(error);
				toast.error("Unable to copy coupon. Try again.");
			}

			try {
				const response = await fetch("/api/stripe/intent", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						price: Math.round(aiCreditsProduct.price * 100),
						description: `${aiCreditsProduct.name} (${coupon})`,
						metadata: {
							productId: aiCreditsProduct.id,
							productName: aiCreditsProduct.name,
							couponCode: coupon,
							productCategories: aiCreditsProduct.categories
								?.map((category) => category)
								.join(","),
						},
					}),
				});

				if (!response.ok) {
					const errorData = await response
						.json()
						.catch(() => ({ message: "Failed to start checkout" }));
					throw new Error(errorData.message || "Failed to start checkout");
				}

				const data = (await response.json()) as {
					clientSecret?: string;
					id?: string;
				};
				if (!data.clientSecret) {
					throw new Error("Checkout unavailable. Please try again.");
				}

				// Try to apply discount, but don't fail if it doesn't work
				if (data.id) {
					const applyDiscount = await fetch("/api/stripe/intent", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							intentId: data.id,
							discountCode: coupon,
						}),
					});

					if (!applyDiscount.ok) {
						// If discount fails, just show a warning but still open checkout
						// The coupon is already copied, so user can apply it manually
						console.warn(
							"Discount code could not be automatically applied:",
							coupon,
						);
						toast.success(
							`Coupon ${coupon} copied. Apply it in checkout to claim the discount.`,
						);
					}
				}

				setProductCheckoutSecret(data.clientSecret);
				stripeToast.success(
					"Checkout ready. Review the Stripe modal to finish your purchase.",
				);
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Checkout failed. Please try again.";
				stripeToast.error(message);
				console.error("AI credits checkout error:", error);
				setProductCheckoutCoupon(null);
				setProductCheckoutDiscount(null);
			} finally {
				setProductCheckoutLoading(false);
			}
		},
		[aiCreditsProduct],
	);

	const handleCloseProductCheckout = () => {
		setProductCheckoutSecret(null);
		setProductCheckoutCoupon(null);
		setProductCheckoutDiscount(null);
	};

	const handleStartTrial = useCallback(async () => {
		if (trialLoading) {
			return;
		}

		if (!basicPlan) {
			toast.error(
				"The Basic plan is currently unavailable. Please try again soon.",
			);
			return;
		}

		setTrialLoading(true);
		const stripeToast = startStripeToast("Starting your free trial…");
		try {
			const response = await fetch("/api/stripe/trial", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					planId: basicPlan.id,
					planName: basicPlan.name,
					planPrice: basicPlan.price,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error || "Unable to prepare free trial checkout.",
				);
			}

			const { clientSecret } = (await response.json()) as {
				clientSecret?: string;
			};

			if (!clientSecret) {
				throw new Error("Free trial checkout is unavailable right now.");
			}

			const legacyPlan = toLegacyPlan(basicPlan, "monthly");
			legacyPlan.price.monthly.amount = 0;
			legacyPlan.price.monthly.description = "Free trial — no charge today";
			legacyPlan.price.monthly.features = [
				"No charge today. Keep your Basic access after the trial by staying active.",
				...legacyPlan.price.monthly.features,
			];

			setCheckoutState({
				clientSecret,
				view: "monthly",
				plan: legacyPlan,
				mode: "setup",
				context: "trial",
				postTrialAmount: basicPlan.price,
			});
			stripeToast.success(
				"Free trial ready. Review the checkout modal to finish activation.",
			);
		} catch (error) {
			stripeToast.error(
				error instanceof Error
					? error.message
					: "Unable to start the free trial.",
			);
			console.error("Trial checkout error:", error);
		} finally {
			setTrialLoading(false);
		}
	}, [basicPlan, trialLoading]);

	const isMinimalMode =
		!showFreePreview && !showUpgradeStack && !showAddOnStack && !showPilotBlurb;

	const minimalStackActive =
		view === "monthly" && !showFreePreview && !!freePlan && !!basicPlan;

	const minimalStackItems = useMemo(() => {
		if (!minimalStackActive || !freePlan || !basicPlan) {
			return [];
		}

		return [
			{
				id: 0,
				name: freePlan.name,
				designation: "Free Trial",
				content: (
					<RecurringPlanCard
						plan={{
							...freePlan,
							ctaType: "upgrade",
						}}
						view="monthly"
						onSubscribe={() => {
							if (!trialLoading) {
								void handleStartTrial();
							}
						}}
						loading={trialLoading}
						ctaOverride={{
							label: trialLoading ? "Starting Trial..." : "Start Free Trial",
							onClick: () => {
								if (!trialLoading) {
									void handleStartTrial();
								}
							},
						}}
						badge={
							<div className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">
								Limited-Time Trial · Ends in {countdown}
							</div>
						}
					/>
				),
			},
			{
				id: 1,
				name: basicPlan.name,
				designation: "Basic Plan",
				content: (
					<RecurringPlanCard
						plan={basicPlan}
						view="monthly"
						onSubscribe={() => {
							void handleSubscribe(basicPlan, "monthly");
						}}
						loading={loading === `${basicPlan.id}-monthly`}
						ctaOverride={{
							label:
								loading === `${basicPlan.id}-monthly`
									? "Processing..."
									: `Choose ${basicPlan.name}`,
							onClick: () => {
								if (loading !== `${basicPlan.id}-monthly`) {
									void handleSubscribe(basicPlan, "monthly");
								}
							},
						}}
						badge={
							<div className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">
								Pilot pricing locks in for 2 years
							</div>
						}
					/>
				),
			},
		];
	}, [
		basicPlan,
		countdown,
		freePlan,
		handleStartTrial,
		handleSubscribe,
		loading,
		minimalStackActive,
		trialLoading,
	]);

	const stackItems = useMemo(() => {
		const items: Array<{
			id: number;
			name: string;
			designation: string;
			content: ReactNode;
		}> = [];

		if (showUpgradeStack && basicPlan) {
			items.push({
				id: 0,
				name: basicPlan.name,
				designation: "Pilot pricing locks in for 2 years",
				content: (
					<div className="flex flex-col gap-4">
						<div className="space-y-1">
							<p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
								Most Popular
							</p>
							<h4 className="font-semibold text-foreground text-lg">
								{basicPlan.name}
							</h4>
							<p className="text-muted-foreground text-xs">
								{basicPlan.features?.[0] ??
									"Voice & SMS automation bundle ready to scale."}
							</p>
						</div>
						<div className="rounded-lg border border-primary/10 bg-primary/5 p-3 text-center text-[11px] text-primary">
							Pilot pricing guarantees your rate for 2 years.
						</div>
						<Button
							size="sm"
							onClick={() => {
								void handleSubscribe(basicPlan, "monthly");
							}}
						>
							Lock In Pilot Pricing
						</Button>
					</div>
				),
			});
		}

		if (showUpgradeStack && starterPlan) {
			items.push({
				id: 1,
				name: starterPlan.name,
				designation: "Scale teams quickly",
				content: (
					<div className="flex flex-col gap-4">
						<div className="space-y-1">
							<p className="text-[10px] text-primary/60 uppercase tracking-[0.25em]">
								Upgrade Path
							</p>
							<h4 className="font-semibold text-foreground text-lg">
								{starterPlan.name}
							</h4>
							<p className="text-muted-foreground text-xs">
								{starterPlan.features?.[1] ??
									"Workflow automation and inbound AI agents for multi-market teams."}
							</p>
						</div>
						<div className="rounded-lg border border-primary/10 bg-primary/5 p-3 text-center text-[11px] text-primary">
							Scale to inbound automation with dedicated success support.
						</div>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => router.push("/contact")}
						>
							Plan Demo Call
						</Button>
					</div>
				),
			});
		}

		if (showAddOnStack && aiCreditsProduct) {
			items.push({
				id: 2,
				name: "AI Credits",
				designation: "Add-on Discount",
				content: (
					<div className="flex flex-col gap-4">
						<div className="space-y-1">
							<p className="text-[10px] text-primary/70 uppercase tracking-[0.25em]">
								Add-On Boost
							</p>
							<h4 className="font-semibold text-foreground text-lg">
								AI Conversation Credits
							</h4>
							<p className="text-muted-foreground text-xs">
								Top up automation credits with the launch coupon applied
								instantly.
							</p>
						</div>
						<button
							type="button"
							className="group flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-center font-semibold text-[11px] text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={productCheckoutLoading}
							onClick={() => handleProductCheckout("SCALE50")}
							aria-live="assertive"
						>
							{productCheckoutLoading ? (
								<>
									<Loader2 className="h-3 w-3 animate-spin" aria-hidden />
									<span className="sr-only">Preparing checkout…</span>
									<span aria-hidden>Preparing checkout…</span>
								</>
							) : (
								<>
									<svg
										role="img"
										className="h-3 w-3 opacity-70 transition group-hover:opacity-100"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
									>
										<title>Copy discount icon</title>
										<path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
										<rect width="12" height="12" x="3" y="7" rx="2" />
									</svg>
									<span>
										Copy{" "}
										<span className="font-mono tracking-[0.3em]">SCALE50</span>{" "}
										& Open Checkout
									</span>
								</>
							)}
						</button>
						<p className="text-center text-[11px] text-muted-foreground">
							Modal opens with discount applied.
						</p>
					</div>
				),
			});
		}

		return items;
	}, [
		aiCreditsProduct,
		basicPlan,
		handleProductCheckout,
		handleSubscribe,
		productCheckoutLoading,
		router,
		showAddOnStack,
		showUpgradeStack,
		starterPlan,
	]);

	const highestMonthlyPlanPrice = useMemo(() => {
		const monthlyPlans = catalog.pricing.monthly;
		if (!monthlyPlans || monthlyPlans.length === 0) {
			return null;
		}

		return monthlyPlans.reduce((max, plan) => {
			return plan.price > max ? plan.price : max;
		}, 0);
	}, [catalog]);

	const topTierCommissionLabel = useMemo(() => {
		if (!highestMonthlyPlanPrice) {
			return null;
		}

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(highestMonthlyPlanPrice * 0.5);
	}, [highestMonthlyPlanPrice]);

	return (
		<>
			<section id="pricing" className="relative px-6 lg:px-8">
				<div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-10" />
				<div className="mx-auto max-w-6xl">
					<header className="text-center">
						<p className="text-primary/70 text-xs uppercase tracking-wide">
							Pricing
						</p>
						<h2 className="mt-2 font-semibold text-4xl text-foreground">
							{title}
						</h2>
						<p className="mt-4 text-muted-foreground">{subtitle}</p>
						<div className="mt-6 inline-flex gap-2 rounded-full border border-border/70 bg-background/80 p-1 shadow-inner backdrop-blur">
							{VIEW_OPTIONS.filter(({ value }) =>
								availableViews.includes(value),
							).map(({ value, label }) => (
								<Button
									key={value}
									variant={view === value ? "default" : "ghost"}
									size="sm"
									className={cn(
										"rounded-full px-4",
										view === value ? "shadow-md" : "text-muted-foreground",
									)}
									onClick={() => handleViewChange(value)}
								>
									{label}
								</Button>
							))}
						</div>
					</header>

					{view === "monthly" ? (
						<div className="mt-12 space-y-6">
							{(showFreePreview ||
								(showUpgradeStack && stackItems.length > 0)) && (
								<div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
									{showFreePreview && (
										<GlassCard className="flex flex-col items-center gap-5 p-6 text-center">
											<div className="flex flex-col items-center gap-2">
												<Badge
													variant="secondary"
													className="bg-primary/10 text-primary"
												>
													Free Trial
												</Badge>
												<h3 className="font-semibold text-2xl text-foreground">
													Explore DealScale with 5 AI demo credits
												</h3>
												<p className="text-muted-foreground text-sm">
													Test outbound cadences, dashboard analytics, and CRM
													sync before you upgrade. Pilot pricing locks in for 2
													years once you activate.
												</p>
												<p className="text-muted-foreground text-xs">
													After the trial you can continue with the Basic plan
													at ${basicPlan?.price.toLocaleString() ?? "2,000"}
													/mo—cancel anytime before the renewal.
												</p>
											</div>
											<ul className="list-none space-y-3 text-center text-muted-foreground text-sm">
												{freePlan?.features?.map((feature) => (
													<li key={feature}>{feature}</li>
												)) ?? (
													<>
														<li>
															5 AI demo credits (approx. 4–5 minutes of AI call
															time)
														</li>
														<li>1 active campaign</li>
														<li>Dashboard + CRM preview</li>
													</>
												)}
											</ul>
											<div className="flex w-full flex-col gap-3 sm:flex-row">
												<Button
													className="flex-1"
													onClick={handleStartTrial}
													disabled={trialLoading}
													aria-live="assertive"
												>
													{trialLoading ? (
														<>
															<Loader2
																className="mr-2 h-4 w-4 animate-spin"
																aria-hidden
															/>
															<span className="sr-only">Starting trial…</span>
															<span aria-hidden>Starting trial…</span>
														</>
													) : (
														"Start Free Trial"
													)}
												</Button>
												<Button
													variant="outline"
													className="flex-1 whitespace-nowrap"
													onClick={() => {
														if (starterPlan) {
															void handleSubscribe(starterPlan, "monthly");
														} else {
															toast.error(
																"Starter plan checkout is temporarily unavailable.",
															);
														}
													}}
													disabled={loading === `${starterPlan?.id}-monthly`}
												>
													Lock In Pricing for 2 Years
												</Button>
											</div>
										</GlassCard>
									)}
									{showUpgradeStack && stackItems.length > 0 && (
										<div className="flex items-center justify-center">
											<CardStack
												items={stackItems}
												offset={8}
												scaleFactor={0.04}
												height={180}
											/>
										</div>
									)}
								</div>
							)}
							{showPilotBlurb && (
								<GlassCard className="flex flex-col gap-4 border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background/90 p-6 lg:flex-row lg:items-center">
									<div className="space-y-2">
										<p className="text-primary/70 text-xs uppercase">
											Pilot Testing Program
										</p>
										<h3 className="font-semibold text-foreground text-xl">
											Upgrade unlocks full automation and white-glove onboarding
										</h3>
										<p className="text-muted-foreground text-sm">
											Basic adds automation-ready credits, custom voices, and
											CRM sync with pilot pricing locked for{" "}
											<strong>2 years</strong>. Starter goes further with
											workflow automation, medium queue access, and inbound
											agents.
										</p>
									</div>
									<Button
										variant="secondary"
										className="whitespace-nowrap"
										onClick={() => {
											if (basicPlan) {
												void handleSubscribe(basicPlan, "monthly");
											} else {
												router.push("/contact");
											}
										}}
									>
										Preview Upgrade Checkout
									</Button>
								</GlassCard>
							)}
						</div>
					) : null}

					{view !== "oneTime" && recurringPlans.length > 0 ? (
						<div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2">
							{minimalStackActive && minimalStackItems.length === 2 ? (
								<div className="md:col-span-2">
									<CardStack
										items={minimalStackItems}
										offset={20}
										scaleFactor={0.04}
										height={560}
										className="max-w-[24rem]"
									/>
								</div>
							) : null}
							{recurringPlans.map((plan) => {
								if (minimalStackActive && plan.id === basicPlan?.id) {
									return null;
								}

								const monthlyBadgeConfig =
									view === "monthly" ? MONTHLY_PLAN_BADGES[plan.id] : undefined;
								const annualBadgeConfig =
									view === "annual" ? ANNUAL_PLAN_BADGES[plan.id] : undefined;

								const defaultAnnualBadge =
									view === "annual" &&
									plan.ctaType === "subscribe" &&
									!annualBadgeConfig ? (
										<Badge
											variant="secondary"
											className="bg-primary/10 text-primary"
										>
											Save 15%
										</Badge>
									) : undefined;

								return (
									<RecurringPlanCard
										key={`${plan.id}-${view}`}
										plan={plan}
										view={view === "monthly" ? "monthly" : "annual"}
										onSubscribe={
											plan.ctaType === "subscribe"
												? () =>
														void handleSubscribe(
															plan,
															view === "monthly" ? "monthly" : "annual",
														)
												: undefined
										}
										loading={
											loading ===
											`${plan.id}-${view === "monthly" ? "monthly" : "annual"}`
										}
										ctaOverride={
											plan.ctaType === "contactSales"
												? {
														label: "Talk to Sales",
														href: "/contact",
													}
												: plan.ctaType === "upgrade"
													? {
															label: "Start Free Trial",
															href: "/signup",
														}
													: undefined
										}
										badge={defaultAnnualBadge}
										badgeLabel={
											monthlyBadgeConfig?.label ?? annualBadgeConfig?.label
										}
										badgeVariant={
											monthlyBadgeConfig?.variant ?? annualBadgeConfig?.variant
										}
									/>
								);
							})}
						</div>
					) : null}

					{view === "oneTime" ? (
						<div className="mt-12 flex flex-col gap-6 lg:grid lg:grid-cols-12">
							<div className="flex flex-col gap-8 lg:col-span-5">
								<SelfHostedCard
									variant="selfHosted"
									title={
										selfHostedPlan?.name ??
										"Self-Hosted / AI Enablement License"
									}
									description={
										selfHostedPlan?.pricingModel ?? "Custom — Contact Sales"
									}
									features={
										selfHostedPlan?.includes ?? [
											"Private deployment with Docker/Kubernetes support",
											"White-label branding & dedicated RBAC",
											"Compliance toolkit (TCPA, GDPR, Colorado AI Act)",
										]
									}
									summary={
										selfHostedPlan?.notes.slice(0, 3) ?? [
											"Setup cost typically equals 5–10% of Year-1 ROI.",
											"Average partners reach 2–3× ROI in Year-1.",
											"Buyout ends revenue share after a 3-year runway.",
										]
									}
									requirements={
										selfHostedPlan?.requirements ?? [
											"Executive sponsor for AI governance sign-off",
											"Secure cloud or on-prem budget for private deployment",
											"Dedicated technical contact for integrations",
											"Annual compliance review cadence with DealScale success team",
										]
									}
									onPrimary={() => router.push("/contact")}
									primaryLabel={
										selfHostedPlan?.ctaPrimary.label ?? "Contact Sales"
									}
									onSecondary={() => setRoiOpen(true)}
									secondaryLabel={
										selfHostedPlan?.ctaSecondary.label ??
										"Estimate ROI & Setup Cost"
									}
								/>
							</div>
							<div className="lg:col-span-7">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									{partnershipPlans.map((plan) => {
										const badgeConfig = ONE_TIME_PLAN_BADGES[plan.id];

										return (
											<PartnershipCard
												key={plan.id}
												{...toPartnershipProps(plan)}
												badgeLabel={badgeConfig?.label}
												badgeVariant={badgeConfig?.variant}
											/>
										);
									})}
								</div>
							</div>
						</div>
					) : null}
				</div>

				{checkoutState ? (
					<PricingCheckoutDialog
						clientSecret={checkoutState.clientSecret}
						plan={checkoutState.plan}
						planType={checkoutState.view}
						mode={checkoutState.mode}
						context={checkoutState.context}
						postTrialAmount={checkoutState.postTrialAmount}
						onClose={() => setCheckoutState(null)}
					/>
				) : null}

				{selfHostedPlan ? (
					<RoiEstimatorModal
						open={roiOpen}
						onOpenChange={setRoiOpen}
						estimator={selfHostedPlan.roiEstimator}
					/>
				) : null}

				{productCheckoutSecret && stripePromise && aiCreditsProduct ? (
					<ProductSelectionProvider>
						<Elements
							stripe={stripePromise}
							options={{
								clientSecret: productCheckoutSecret,
								appearance: {
									theme: "stripe",
									variables: { colorPrimary: "#4f46e5" },
								},
							}}
						>
							<ProductCheckoutForm
								product={aiCreditsProduct}
								onClose={handleCloseProductCheckout}
								clientSecret={productCheckoutSecret}
								prefilledDiscountCode={productCheckoutCoupon ?? undefined}
								prefilledDiscount={productCheckoutDiscount ?? undefined}
							/>
						</Elements>
					</ProductSelectionProvider>
				) : null}
			</section>
			{!isMinimalMode ? (
				<div className="mt-16">
					<AffiliatePartnerTeaser
						commissionAmount={topTierCommissionLabel}
						onOpenTiers={() => setAffiliateModalOpen(true)}
					/>
				</div>
			) : null}
			<AffiliateCommissionModal
				open={affiliateModalOpen}
				onOpenChange={setAffiliateModalOpen}
				topCommissionLabel={topTierCommissionLabel}
			/>
		</>
	);
};

export default CatalogPricing;
