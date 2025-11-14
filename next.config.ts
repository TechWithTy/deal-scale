import { createRequire } from "node:module";
// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const ANALYZE = process.env.ANALYZE === "true";

const require = createRequire(import.meta.url);

const createBundleAnalyzer = (): ((config: NextConfig) => NextConfig) => {
	if (!ANALYZE) {
		return (config) => config;
	}

	try {
		const analyzer = require("@next/bundle-analyzer") as (options: {
			enabled: boolean;
		}) => (config: NextConfig) => NextConfig;

		return analyzer({
			enabled: true,
		});
	} catch (error) {
		console.warn(
			"Skipping bundle analyzer because '@next/bundle-analyzer' is not installed.",
		);
		return (config) => config;
	}
};

const withBundleAnalyzer = createBundleAnalyzer();

const nextConfig: NextConfig = {
	// Optimize package imports to reduce bundle size
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"framer-motion",
			"react-hot-toast",
			"@radix-ui/react-icons",
		],
	},
	// Compiler optimizations
	compiler: {
		// Remove console.log in production (except console.error/warn)
		// Saves ~2-5 KiB and improves performance slightly
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
	},
	// SWC minification is enabled by default in Next.js
	// Browser targeting is handled via browserslist in package.json
	// which targets modern browsers (Chrome 90+, Edge 90+, Firefox 90+, Safari 15+)
	env: {
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		STRIPE_WEB_SECRET: process.env.STRIPE_WEB_SECRET,
	},
	images: {
		// Enable modern image formats (WebP/AVIF) for better compression
		formats: ["image/avif", "image/webp"],
		// Optimize image quality (balance between quality and size)
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Minimum Cache TTL (in seconds) for optimized images
		minimumCacheTTL: isProd ? 60 : 0,
		remotePatterns: [
			{ protocol: "https", hostname: "dealscale.io" },
			{ protocol: "https", hostname: "vectorlogo.zone" },
			{ protocol: "https", hostname: "placehold.co" },
			{ protocol: "https", hostname: "cdn-images-1.medium.com" },
			{ protocol: "https", hostname: "i.imgur.com" },
			{ protocol: "https", hostname: "upload.wikimedia.org" },
			{ protocol: "https", hostname: "images.seeklogo.com" },
			{ protocol: "https", hostname: "kestra.io" },
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
				destination: "/rss.xml",
				permanent: true,
			},
			{
				source: "/rss.xml",
				destination: "/api/rss.xml",
				permanent: true,
			},
			{
				source: "/rss/youtube.xml",
				destination: "/api/rss/youtube.xml",
				permanent: true,
			},
			{
				source: "/rss/hybrid.xml",
				destination: "/api/rss/hybrid.xml",
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
			{
				source: "/discord",
				destination: "https://discord.gg/BNrsYRPtFN",
				permanent: true,
			},
		];
	},
	async headers() {
		if (!isProd) {
			return [
				{
					source: "/:path*",
					headers: [
						{
							key: "Cache-Control",
							value: "no-store, must-revalidate",
						},
					],
				},
			];
		}

		const cacheControl = isProd
			? "public, max-age=31536000, immutable"
			: "no-store, must-revalidate";

		return [
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: cacheControl,
					},
				],
			},
			{
				source: "/_next/image",
				headers: [
					{
						key: "Cache-Control",
						value: cacheControl,
					},
				],
			},
			{
				source: "/:all*(svg|png|jpg|jpeg|gif|webp|avif|woff2)",
				headers: [
					{
						key: "Cache-Control",
						value: isProd
							? "public, max-age=2592000, must-revalidate"
							: cacheControl,
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: cacheControl,
					},
				],
			},
			{
				source: "/assets/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: cacheControl,
					},
				],
			},
			{
				source: "/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: cacheControl,
					},
				],
			},
		];
	},
};

export default withBundleAnalyzer(nextConfig);
