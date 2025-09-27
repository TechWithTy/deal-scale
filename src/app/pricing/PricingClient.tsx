"use client";

import Pricing from "@/components/home/Pricing";
import type { Plan } from "@/types/service/plans";
import { useSearchParams } from "next/navigation";

/**
 * Props for PricingClient, supporting callbackUrl for post-auth/payment redirects.
 */
interface PricingProps {
	title?: string;
	subtitle?: string;
	plans: Plan[];
}

const PricingClient: React.FC<PricingProps> = ({
	title = "Pricing",
	subtitle = "Find answers to common questions about our services, process, and technology expertise.",
	plans,
}: PricingProps) => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") || undefined;

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 dark:from-black dark:to-gray-900">
			<Pricing
				title={title}
				subtitle={subtitle}
				plans={plans}
				callbackUrl={callbackUrl}
			/>
		</div>
	);
};

export default PricingClient;
