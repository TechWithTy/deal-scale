import { MarkdownContent } from "@/components/legal/markdown";
import { hipaaMarkdown } from "@/data/constants/legal/hippa";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Centralized SEO for /hipaa using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/hipaa");
	return mapSeoMetaToMetadata(seo);
}

const HippaPage = () => {
	return (
		<>
			<div className="mx-auto my-5 max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<MarkdownContent
					content={hipaaMarkdown}
					className="prose prose-indigo prose-lg mx-auto"
				/>
			</div>
		</>
	);
};

export default HippaPage;
