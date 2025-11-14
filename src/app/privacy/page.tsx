import { MarkdownContent } from "@/components/legal/markdown";
import { privacyPolicyMarkdown } from "@/data/constants/legal/privacy";
import { buildLegalJsonLd, getLegalDocumentByPath } from "@/utils/seo/legalSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /privacy using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/privacy");
	return mapSeoMetaToMetadata(seo);
}

const PrivacyPolicy = () => {
	const privacyDocument = getLegalDocumentByPath("/privacy");
	return (
		<>
			{privacyDocument && (
				<SchemaInjector schema={buildLegalJsonLd(privacyDocument)} />
			)}
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
