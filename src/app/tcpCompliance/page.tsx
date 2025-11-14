import { MarkdownContent } from "@/components/legal/markdown";
import { tcpComplianceMarkdown } from "@/data/constants/legal/tcpCompliance";
import { buildLegalJsonLd, getLegalDocumentByPath } from "@/utils/seo/legalSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /tcpCompliance using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/tcpCompliance");
	return mapSeoMetaToMetadata(seo);
}

const TCAPage = () => {
	const tcpaDocument = getLegalDocumentByPath("/tcpCompliance");
	return (
		<>
			{tcpaDocument && (
				<SchemaInjector schema={buildLegalJsonLd(tcpaDocument)} />
			)}
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={tcpComplianceMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default TCAPage;
