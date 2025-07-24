import Header from "@/components/common/Header";
import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";

/**
 * * TrustedBySection: Logos of trusted companies
 */
export default function TrustedBySection() {
	return (
		<div>
			<Header title="Beta Testers" subtitle="" />
			<TrustedByScroller variant="secondary" items={companyLogos} />
		</div>
	);
}
