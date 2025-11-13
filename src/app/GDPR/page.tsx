import { MarkdownContent } from "@/components/legal/markdown";
import { gdprPolicyMarkdown } from "@/data/constants/legal/GDPR";
import { buildLegalJsonLd, getLegalDocumentByPath } from "@/utils/seo/legalSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /GDPR using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/GDPR");
	return mapSeoMetaToMetadata(seo);
}

const GDPRPage = () => {
	const gdprDocument = getLegalDocumentByPath("/GDPR");
	return (
		<>
			{gdprDocument && (
				<SchemaInjector schema={buildLegalJsonLd(gdprDocument)} />
			)}
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={gdprPolicyMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default GDPRPage;
