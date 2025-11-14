import { MarkdownContent } from "@/components/legal/markdown";
import { cookiesPolicyMarkdown } from "@/data/constants/legal/cookies";
import { buildLegalJsonLd, getLegalDocumentByPath } from "@/utils/seo/legalSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
// * Centralized SEO for /tos using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/cookies");
	return mapSeoMetaToMetadata(seo);
}

const CookiePolicy = () => {
	const cookieDocument = getLegalDocumentByPath("/cookies");
	return (
		<>
			{cookieDocument && (
				<SchemaInjector schema={buildLegalJsonLd(cookieDocument)} />
			)}
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={cookiesPolicyMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default CookiePolicy;
