import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { Plan, PlanType } from "@/types/service/plans";
import { Check, Loader2 } from "lucide-react";
import type * as React from "react";
import BannerRibbon from "./BannerRibbon";
import DiscountBanner from "./DiscountBanner";

interface PricingCardProps {
	plan: Plan;
	planType: PlanType;
	loading: string | null;
	onCheckout: (plan: Plan, callbackUrl?: string) => void;
	callbackUrl?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
	plan,
	planType,
	loading,
	onCheckout,
	callbackUrl,
}) => {
	const hasMounted = useHasMounted();

	const formatPrice = (price: number | string) => {
		if (typeof price === "string" && price.endsWith("%")) {
			return price;
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(Number(price));
	};

	const planPrice = plan.price[planType];

	return (
		<div className="relative flex h-full flex-col">
			{plan.highlighted && (
				<div className="-top-6 -translate-x-1/2 absolute left-1/2 z-20 whitespace-nowrap rounded-full bg-primary px-5 py-1 font-semibold text-black text-xs shadow-lg dark:text-white">
					Most Popular
				</div>
			)}

			<GlassCard
				highlighted={plan.highlighted}
				className={`flex h-full w-full max-w-sm flex-col ${plan.highlighted ? "mt-8 border-2 border-primary/60 shadow-xl" : ""}`}
			>
				<div className="flex h-full flex-col p-8">
					<div className="min-h-[120px]">
						{planType === "annual" && plan.price.annual.bannerText && (
							<BannerRibbon text={plan.price.annual.bannerText} />
						)}
						{planType === "annual" && plan.price.annual.discount && (
							<DiscountBanner
								code={plan.price.annual.discount.code}
								expires={plan.price.annual.discount.code.expires}
								text={undefined}
								onClick={
									!plan.price.annual.discount.autoApply
										? () => window.scrollTo({ top: 0, behavior: "smooth" })
										: undefined
								}
							/>
						)}

						<h3 className="mb-2 text-center font-bold text-2xl text-black-900 dark:text-white-900">
							{plan.name}
						</h3>
						<p className="mb-6 text-center text-black-600 text-sm dark:text-white-600">
							{planPrice.description}
						</p>
					</div>

					<div className="mb-8 flex flex-col items-center">
						<div className="flex w-full flex-col items-center justify-center gap-1">
							{planType === "annual" && plan.price.annual.discount ? (
								<>
									<span className="mb-1 block font-semibold text-black-400 text-xl line-through opacity-70 dark:text-white-700">
										{formatPrice(plan.price.annual.amount)} / year
									</span>
									<span className="mb-0 block bg-gradient-to-r from-primary to-focus bg-clip-text font-bold text-4xl text-transparent drop-shadow">
										{formatPrice(
											plan.price.annual.discount.code.discountPercent
												? Math.round(
														plan.price.annual.amount *
															(1 -
																plan.price.annual.discount.code
																	.discountPercent /
																	100),
													)
												: plan.price.annual.discount.code.discountAmount
													? Math.max(
															0,
															plan.price.annual.amount -
																plan.price.annual.discount.code.discountAmount,
														)
													: plan.price.annual.amount,
										)}{" "}
										<span className="font-normal text-base text-black-600 dark:text-white-600">
											/ year
										</span>
									</span>
								</>
							) : (
								<>
									<span
										className={`font-bold text-4xl ${plan.highlighted ? "bg-gradient-to-r from-primary to-focus bg-clip-text text-transparent" : "text-black-900 dark:text-white-900"}`}
									>
										{formatPrice(planPrice.amount)}
									</span>
									{!planPrice.amount.toString().endsWith("%") && (
										<span className="ml-1 text-base text-black-600 dark:text-white-600">
											{planType === "monthly"
												? "/ month"
												: planType === "annual"
													? "/ year"
													: ""}
										</span>
									)}
								</>
							)}
						</div>
					</div>

					<div className="max-h-[180px] min-h-[180px] flex-1 overflow-y-auto">
						<ul className="space-y-3 pr-2">
							{planPrice.features.map((feature, index) => (
								<li
									key={feature}
									className={`flex items-center gap-3 ${index >= 4 ? "opacity-90" : ""}`}
								>
									<span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
										<Check
											className="h-3 w-3 text-primary"
											aria-hidden="true"
										/>
									</span>
									<span className="text-black-900 text-sm dark:text-white-900">
										{feature}
									</span>
								</li>
							))}
						</ul>
					</div>

					<div className="mt-6 border-white/10 border-t pt-4">
						{hasMounted && (
							<Button
								className={`min-h-[3.5rem] w-full whitespace-normal rounded-lg py-3 font-semibold text-base leading-snug shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/60 ${plan.highlighted ? "glow bg-gradient-to-r from-primary to-focus text-black-900 dark:text-white-900" : "bg-white/10 text-black-900 hover:bg-white/20 dark:text-white-900"}`}
								disabled={loading === plan.id}
								onClick={() => onCheckout(plan, callbackUrl)}
								aria-live="assertive"
							>
								{loading === plan.id ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
										<span className="sr-only">Processing checkout…</span>
										<span aria-hidden>Processing…</span>
									</>
								) : typeof plan.cta === "string" ? (
									plan.cta
								) : (
									plan.cta?.text || "Buy Now"
								)}
							</Button>
						)}
					</div>
				</div>
			</GlassCard>
		</div>
	);
};

export default PricingCard;
