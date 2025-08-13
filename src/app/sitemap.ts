import { getAllProducts } from "@/data/products/index";
import { getAllServices } from "@/data/service/services";
import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { getAllCaseStudies } from "@/lib/caseStudies/case-studies";
import type { BeehiivPost } from "@/types/behiiv";
import { getTestBaseUrl } from "@/utils/env";
import { getSeoMetadataForPost } from "@/utils/seo/dynamic/blog";
import { getSeoMetadataForCaseStudy } from "@/utils/seo/dynamic/case-studies";
import { getSeoMetadataForService } from "@/utils/seo/dynamic/services";
import { getSeoMetadataForProduct } from "@/utils/seo/product";
import type { SeoMeta } from "@/utils/seo/seo";
import { defaultSeo, staticSeoMeta } from "@/utils/seo/staticSeo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Resolve and normalize the canonical base URL
	const normalize = (raw: string): string => {
		let url = (raw || "").trim();
		if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
		url = url.replace(/^https:\/(?!\/)/i, "https://");
		url = url.replace(/^http:\/(?!\/)/i, "http://");
		return url.replace(/\/+$/g, "");
	};
	const baseUrl = normalize(defaultSeo.canonical || getTestBaseUrl());
	// Static pages with SEO metadata for sitemap

	const staticPaths = [
		"/",
		"/privacy",
		"/blogs",
		"/case-studies",
		"/contact",
		"/contact-pilot",
		"/cookies",
		"/events",
		"/faqs",
		"/pricing",
		"/portfolio",
		"/features",
		"/tos",
		"/products",
	];

	const staticPages = staticPaths.map((path) => {
		// Get SEO data for the path, fallback to empty object with SeoMeta type
		const seo: Partial<SeoMeta> =
			path === "/" ? defaultSeo : staticSeoMeta[path] || {};

		// Create a complete SeoMeta object with all required fields
		const defaultValues: SeoMeta = {
			title: seo.title || defaultSeo.title,
			description: seo.description || defaultSeo.description,
			canonical:
				seo.canonical || `${defaultSeo.canonical}${path === "/" ? "" : path}`,
			keywords: seo.keywords || defaultSeo.keywords,
			image: seo.image || defaultSeo.image,
			siteName: seo.siteName || defaultSeo.siteName,
			type: seo.type || defaultSeo.type,
			dateModified: seo.dateModified,
			datePublished: seo.datePublished,
			priority: seo.priority ?? 0.8,
			changeFrequency: seo.changeFrequency || "weekly",
		};

		return {
			url: defaultValues.canonical,
			lastModified: defaultValues.dateModified
				? new Date(defaultValues.dateModified)
				: new Date(),
			publishedTime: defaultValues.datePublished
				? new Date(defaultValues.datePublished)
				: undefined,
			changefreq: defaultValues.changeFrequency,
			priority: defaultValues.priority,
			canonical: defaultValues.canonical,
			description: defaultValues.description,
			type: defaultValues.type,
			keywords: defaultValues.keywords,
			title: defaultValues.title,
			image: defaultValues.image,
		};
	});

	// Dynamic blog posts with SEO

	const posts = await getLatestBeehiivPosts();
	const blogPosts = await Promise.all(
		posts.map(async (post) => {
			const seo = await getSeoMetadataForPost(post.id);
			return {
				url: seo?.canonical || post.web_url || "",
				lastModified:
					typeof post.published_at === "string" ||
					typeof post.published_at === "number"
						? new Date(post.published_at)
						: new Date(),
				canonical: seo?.canonical,
				title: seo?.title,
				description: seo?.description,
				keywords: seo?.keywords,
				image: seo?.image,
				type: "website",
				changefreq: seo?.changeFrequency || "weekly",
				priority: typeof seo?.priority === "number" ? seo.priority : 0.7,
			};
		}),
	);

	// Dynamic case studies with SEO
	const caseStudies = await getAllCaseStudies();
	const caseStudyEntries = await Promise.all(
		caseStudies.map(async (study) => {
			const seo = await getSeoMetadataForCaseStudy(study.slug);
			return {
				url: `${baseUrl}/case-studies/${study.slug}`,
				lastModified: study.lastModified,
				canonical: seo?.canonical,
				title: seo?.title,
				type: "website",
				description: seo?.description,
				keywords: seo?.keywords,
				image: seo?.image,
				changefreq: seo?.changeFrequency || "weekly",
				priority: typeof seo?.priority === "number" ? seo.priority : 0.7,
			};
		}),
	);

	// Dynamic products with SEO
	const products = getAllProducts();
	const productEntries = await Promise.all(
		products.map(async (product) => {
			const seo = await getSeoMetadataForProduct(product.slug ?? product.sku);
			return {
				url: `${baseUrl}/products/${product.slug ?? product.sku}`,
				lastModified: new Date(), // If you have per-product dates, use them
				canonical: seo?.canonical,
				title: seo?.title,
				description: seo?.description,
				keywords: seo?.keywords,
				image: seo?.image,
				type: "website",
				changefreq: seo?.changeFrequency || "monthly",
				priority: typeof seo?.priority === "number" ? seo.priority : 0.6,
			};
		}),
	);

	// todo: Add services with SEO when getAllServices is available
	const services = await getAllServices();
	const serviceEntries = await Promise.all(
		services.map(async (service) => {
			const seo = await getSeoMetadataForService(
				service.slugDetails.slug,
				services,
			);
			return {
				url: `${baseUrl}/features/${service.slugDetails.slug}`,
				lastModified: service.slugDetails.lastModified,
				canonical: seo?.canonical,
				title: seo?.title,
				description: seo?.description,
				image: seo?.image,
				keywords: seo?.keywords,
				type: "website",
				changefreq: seo?.changeFrequency || "weekly",
				priority: typeof seo?.priority === "number" ? seo.priority : 0.8,
			};
		}),
	);

	// Dynamic services
	// const services = await getAllServices();
	// const serviceEntries = services.map((service) => ({
	// 	url: `${baseUrl}/services/${service.slug}`,
	// 	lastModified: service.lastModified,
	// }));

	return [
		...staticPages,
		...blogPosts,
		...caseStudyEntries,
		...productEntries,
		...serviceEntries,
	];
}
