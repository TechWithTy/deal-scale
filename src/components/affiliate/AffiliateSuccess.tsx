import Header from "@/components/common/Header";
import { useEffect, useState } from "react";
// If you have a spinner or shimmer component, import here. Otherwise, use a simple fallback.

import type { DiscountCode } from "@/types/discount/discountCode";

interface AffiliateSuccessProps {
	affiliateId: string;
	discountCode: DiscountCode;
}

import { ContactSteps } from "@/components/contact/form/ContactSteps";
import { affiliateProgramSteps } from "@/data/service/slug_data/consultationSteps";

export default function AffiliateSuccess({
	affiliateId,
	discountCode,
}: AffiliateSuccessProps) {
	const [processing, setProcessing] = useState(true);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setProcessing(false), 2200);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="mx-auto flex max-w-xl flex-col items-center justify-center py-16 text-center">
			{processing ? (
				<>
					<Header
						title="Processing Your Application..."
						subtitle="Please wait while we finalize your affiliate onboarding."
						size="md"
						className="mb-6"
					/>
					<div className="mb-6 flex flex-col items-center">
						{/* Replace with a spinner/shimmer if available */}
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/40 border-t-primary" />
						<span className="mt-4 text-primary/80 text-sm">
							Setting up your affiliate profile...
						</span>
					</div>
				</>
			) : (
				<>
					<Header
						title="Welcome to the Affiliate Program!"
						subtitle="Your application has been approved."
						size="md"
						className="mb-6"
					/>
					<div className="mb-8 flex flex-col items-center justify-center gap-2">
						<div className="rounded-lg bg-success/10 px-6 py-4 font-semibold text-lg text-success">
							Your Affiliate ID:
							<span className="ml-2 select-all font-mono text-success text-xl">
								{discountCode.id}
							</span>
						</div>
						<div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-4 font-semibold text-lg text-primary">
							Discount Code:
							<span className="ml-2 select-all font-mono text-primary text-xl">
								{discountCode.id}
							</span>
							<button
								onClick={() => {
									navigator.clipboard.writeText(discountCode.id);
									setCopied(true);
									setTimeout(() => setCopied(false), 1200);
								}}
								className="ml-2 rounded border border-primary/30 bg-primary/20 px-2 py-1 font-medium text-xs transition-colors hover:bg-primary/30"
								type="button"
							>
								{copied ? "Copied!" : "Copy"}
							</button>
							{discountCode.discountPercent && (
								<span className="ml-4 text-base text-success">
									({discountCode.discountPercent}% OFF
									{typeof discountCode.maxUses === "number"
										? `, ${discountCode.maxUses} uses`
										: ""}
									)
								</span>
							)}
							{!discountCode.discountPercent &&
								typeof discountCode.maxUses === "number" && (
									<span className="ml-4 text-base text-success">
										({discountCode.maxUses} uses)
									</span>
								)}
						</div>
						<div className="mt-2 text-muted-foreground text-sm">
							This unique code has also been emailed to you. Share it to start
							earning 10% commission (up to $4,500 per sale)!
						</div>
					</div>
					<div className="mt-6">
						<span className="text-base text-primary">
							Check your email for next steps, SMS updates, and program
							resources.
						</span>
					</div>
					{/* Next Steps Section */}
				</>
			)}
		</div>
	);
}
