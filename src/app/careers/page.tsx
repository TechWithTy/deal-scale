import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const CAREERS_PORTAL_URL = "https://careers.dealscale.io";

export async function generateMetadata(): Promise<Metadata> {
        const seo = getStaticSeo("/careers");
        const metadata = mapSeoMetaToMetadata(seo);

        return {
                ...metadata,
                description: "Explore open roles at DealScale on our dedicated careers portal.",
                alternates: {
                        canonical: CAREERS_PORTAL_URL,
                },
                robots: {
                        index: false,
                        follow: true,
                },
        };
}

export default function CareersRedirectPage() {
        redirect(CAREERS_PORTAL_URL);
}
