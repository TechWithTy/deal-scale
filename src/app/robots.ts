import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: "/private/",
			},
			// Example: Uncomment to block Bingbot and Applebot
			// {
			//   userAgent: ['Applebot', 'Bingbot'],
			//   disallow: ['/'],
			// },
		],
		sitemap: "https://dealscale.io/sitemap.xml",
		// Optionally add: host: 'https://dealscale.io',
	};
}
