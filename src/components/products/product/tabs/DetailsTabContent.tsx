import type { ShippingTimeEstimate } from "@/types/products/shipping";
import type { ABTestCopy } from "@/types/testing";
import AbTestCopySection from "./AbTestCopySection";
import HighlightsSection from "./HighlightsSection";
import LicenseSection from "./LicenseSection";
import ShippingSection from "./ShippingSection";

import type { LicenseType } from "@/types/products";

interface DetailsTabContentProps {
	description: string;
	abTestCopy?: ABTestCopy;
	licenseName?: LicenseType;
	highlights: string[];
	shipping?: ShippingTimeEstimate;
}
// licenseName now expects a LicenseType enum, not a string.

const DetailsTabContent = ({
	description,
	abTestCopy,
	licenseName,
	highlights,
	shipping,
}: DetailsTabContentProps) => {
	return (
		<div className="prose prose-sm max-w-none text-muted">
			<p className="mb-6 text-lg text-primary leading-7">{description}</p>
			{abTestCopy && <AbTestCopySection abTestCopy={abTestCopy} />}
			{shipping && <ShippingSection shipping={shipping} />}
			{licenseName && <LicenseSection licenseName={licenseName} />}
		</div>
	);
};

export default DetailsTabContent;
