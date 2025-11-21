import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import CloserApplication from "./CloserApplication";

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/closers/apply");
	return mapSeoMetaToMetadata(seo);
}

export default CloserApplication;




