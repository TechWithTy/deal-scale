import { MarkdownContent } from "@/components/legal/markdown";
import { PIIMarkdown } from "@/data/constants/legal/PII";
import { buildLegalJsonLd, getLegalDocumentByPath } from "@/utils/seo/legalSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /PII using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/PII");
	return mapSeoMetaToMetadata(seo);
}

const PIIPage = () => {
	const piiDocument = getLegalDocumentByPath("/PII");
	return (
		<>
			{piiDocument && <SchemaInjector schema={buildLegalJsonLd(piiDocument)} />}
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={PIIMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default PIIPage;
