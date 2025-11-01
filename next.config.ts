// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"framer-motion",
			"react-hot-toast",
			"@radix-ui/react-icons",
		],
	},
	env: {
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		STRIPE_WEB_SECRET: process.env.STRIPE_WEB_SECRET,
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "dealscale.io" },
			{ protocol: "https", hostname: "vectorlogo.zone" },
			{ protocol: "https", hostname: "placehold.co" },
			{ protocol: "https", hostname: "cdn-images-1.medium.com" },
			{ protocol: "https", hostname: "i.imgur.com" },
			{
				protocol: "https",
				hostname: "beehiiv-images-production.s3.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{ protocol: "https", hostname: "media2.giphy.com" },
			{ protocol: "https", hostname: "media1.giphy.com" },
			{ protocol: "https", hostname: "media0.giphy.com" },
			{ protocol: "https", hostname: "media3.giphy.com" },
			{ protocol: "https", hostname: "media4.giphy.com" },
			{ protocol: "https", hostname: "crosscountrymortgage.com" },
			{ protocol: "https", hostname: "onepercenthomesale.com" },
			{ protocol: "https", hostname: "squarespace-cdn.com" },
			{ protocol: "https", hostname: "lirp.cdn-website.com" },
			{ protocol: "https", hostname: "www.dwellist.com" },
			{ protocol: "https", hostname: "downloads.intercomcdn.com" },
			{ protocol: "https", hostname: "media.licdn.com" },
			{ protocol: "https", hostname: "newwestern.com" },
			{ protocol: "https", hostname: "thebuyoutcompany.com" },
			{ protocol: "https", hostname: "www.cretech.com" },
			{ protocol: "https", hostname: "www.housingwire.com" },
		],
	},

	// * Add redirect from /careers to external Zoho Recruit careers page
	async redirects() {
		return [
			{
				source: "/projects",
				destination: "/portfolio",
				permanent: true,
			},
			{
				source: "/careers",
				destination: "https://dealscale.zohorecruit.com/jobs/Careers",
				permanent: true, // ✅ Permanent redirect to pass link equity to careers portal
			},
			{
				source: "/support",
				destination: "https:/dealscale.zohodesk.com/portal/en/home",
				permanent: true,
			},
			{
				source: "/rss",
				destination: "https://rss.beehiiv.com/feeds/th0QQipR7J.xml",
				permanent: true,
			},
			{
				source: "/demo:1",
				destination: "https://lynklet.com/deal-scale-demo-1",
				permanent: true,
			},
			{
				source: "/industries/investors",
				destination:
					"https://blog.dealscale.io/p/forget-zillow-the-best-investment-properties-are-invisible-and-ai-holds-the-key-a661",
				permanent: true,
			},
			{
				source: "/industries/wholesalers",
				destination:
					"https://blog.dealscale.io/p/the-top-1-of-wholesalers-use-ai-are-you-getting-left-behind-e8fd",
				permanent: true,
			},
			{
				source: "/industries/agents",
				destination:
					"https://blog.dealscale.io/p/your-real-estate-crm-is-broken-here-s-the-ai-upgrade-that-actually-converts-leads-e85a",
				permanent: true,
			},

			{
				source: "/pitch-deck-investor",
				destination:
					"https://cal.com/cyber-oni-solutions-inc/investor-pitch-deck-deal-scale",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/_next/image",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/:all*(svg|png|jpg|jpeg|gif|webp|avif|woff2)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, must-revalidate",
					},
				],
			},
		];
	},
};

export default nextConfig;
