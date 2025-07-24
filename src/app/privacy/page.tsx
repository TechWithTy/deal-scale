import { SEOWrapper } from "@/components/common/SEOWrapper";
import { MarkdownContent } from "@/components/legal/markdown";
import { privacyPolicyMarkdown } from "@/data/constants/legal/privacy";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { staticSeoMeta } from "@/utils/seo/staticSeo";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /privacy using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/privacy");
	return mapSeoMetaToMetadata(seo);
}

const PrivacyPolicy = () => {
	return (
		<>
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={privacyPolicyMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default PrivacyPolicy;
