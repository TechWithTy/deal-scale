import { MarkdownContent } from "@/components/legal/markdown";
import { termsOfServiceMarkdown } from "@/data/constants/legal/terms";
import { buildLegalJsonLd, getLegalDocumentByPath } from "@/utils/seo/legalSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /tos using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/tos");
	return mapSeoMetaToMetadata(seo);
}

const TermsOfService = () => {
	const termsDocument = getLegalDocumentByPath("/tos");
	return (
		<>
			{termsDocument && (
				<SchemaInjector schema={buildLegalJsonLd(termsDocument)} />
			)}
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={termsOfServiceMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default TermsOfService;
