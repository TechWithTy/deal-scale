import { defaultSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: defaultSeo.title,
	description: defaultSeo.description,
	keywords: defaultSeo.keywords,
	openGraph: {
		title: defaultSeo.title,
		description: defaultSeo.description,
		url: defaultSeo.canonical,
		type: "website",
		images: [
			{
				url: defaultSeo.image,
				width: 1200,
				height: 630,
				alt: defaultSeo.title,
			},
		],
		siteName: defaultSeo.siteName,
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: defaultSeo.title,
		description: defaultSeo.description,
		creator: "@softwear4u",
		images: ["/images/monster_5.jpg"],
	},
	metadataBase: new URL(process.env.NEXTAUTH_URL || "https://dealscale.io"),
	// Add more defaults as needed
};
