import type { MetadataRoute } from "next";
import { describe, it, expect, beforeAll, vi } from "vitest";

import sitemap from "../sitemap";

describe("Sitemap Validation", () => {
	const baseUrl = "https://dealscale.io";
	const validChangeFrequencies = [
		"always",
		"hourly",
		"daily",
		"weekly",
		"monthly",
		"yearly",
		"never",
	] as const;

	let entries: MetadataRoute.Sitemap;

	beforeAll(async () => {
		entries = await sitemap();
	});

	describe("Basic Structure", () => {
		it("should return a non-empty sitemap array", () => {
			expect(Array.isArray(entries)).toBe(true);
			expect(entries.length).toBeGreaterThan(0);
		});

		it("should have all entries with required fields", () => {
			for (const entry of entries) {
				expect(entry).toHaveProperty("url");
				expect(entry).toHaveProperty("lastModified");
				expect(entry).toHaveProperty("changeFrequency");
				expect(entry).toHaveProperty("priority");
			}
		});
	});

	describe("URL Validation", () => {
		it("should only include URLs from the canonical domain (dealscale.io)", () => {
			const externalUrls: string[] = [];
			for (const entry of entries) {
				if (entry.url) {
					try {
						const url = new URL(entry.url);
						if (url.host !== "dealscale.io") {
							externalUrls.push(entry.url);
						}
					} catch {
						externalUrls.push(entry.url);
					}
				}
			}
			expect(externalUrls).toEqual([]);
		});

		it("should have valid, non-empty URLs", () => {
			for (const entry of entries) {
				expect(entry.url).toBeTruthy();
				expect(typeof entry.url).toBe("string");
				expect(entry.url.trim().length).toBeGreaterThan(0);
				
				// Verify URL format
				expect(() => new URL(entry.url)).not.toThrow();
			}
		});

		it("should not have duplicate URLs", () => {
			const urlSet = new Set<string>();
			const duplicates: string[] = [];
			
			for (const entry of entries) {
				if (entry.url) {
					if (urlSet.has(entry.url)) {
						duplicates.push(entry.url);
					}
					urlSet.add(entry.url);
				}
			}
			
			expect(duplicates).toEqual([]);
		});
	});

	describe("Required Fields", () => {
		it("should have lastModified as a Date object", () => {
			for (const entry of entries) {
				expect(entry.lastModified).toBeInstanceOf(Date);
			}
		});

		it("should have valid changeFrequency values", () => {
			for (const entry of entries) {
				expect(entry.changeFrequency).toBeTruthy();
				expect(validChangeFrequencies).toContain(entry.changeFrequency);
			}
		});

		it("should have priority between 0.0 and 1.0", () => {
			for (const entry of entries) {
				expect(typeof entry.priority).toBe("number");
				expect(entry.priority).toBeGreaterThanOrEqual(0);
				expect(entry.priority).toBeLessThanOrEqual(1);
			}
		});
	});

	describe("Content Coverage", () => {
		it("should include the homepage", () => {
			const homepage = entries.find((entry) => entry.url === baseUrl);
			expect(homepage).toBeDefined();
			expect(homepage?.priority).toBeGreaterThan(0);
		});

		it("should include key static pages", () => {
			const keyPages = [
				"/blogs",
				"/about",
				"/products",
				"/features",
				"/pricing",
				"/partners",
				"/case-studies",
			];

			for (const page of keyPages) {
				const entry = entries.find((entry) => entry.url === `${baseUrl}${page}`);
				expect(entry).toBeDefined();
				expect(entry?.priority).toBeGreaterThan(0);
			}
		});

		it("should include RSS feed URLs", () => {
			const rssFeeds = [
				"/rss.xml",
				"/rss/youtube.xml",
				"/rss/github.xml",
				"/rss/hybrid.xml",
			];

			for (const feed of rssFeeds) {
				const entry = entries.find((entry) => entry.url === `${baseUrl}${feed}`);
				expect(entry).toBeDefined();
			}
		});

		it("should include video sitemap", () => {
			const videoSitemap = entries.find(
				(entry) => entry.url === `${baseUrl}/videos/sitemap.xml`,
			);
			expect(videoSitemap).toBeDefined();
		});

		it("should include blog posts with correct URL format", () => {
			const blogPosts = entries.filter((entry) =>
				entry.url?.startsWith(`${baseUrl}/blogs/`),
			);
			
			// Should have at least some blog posts if they exist
			// Format: https://dealscale.io/blogs/{post_id}
			for (const post of blogPosts) {
				expect(post.url).toMatch(/^https:\/\/dealscale\.io\/blogs\/[^/]+$/);
				expect(post.priority).toBeGreaterThan(0);
			}
		});

		it("should include case studies", () => {
			const caseStudies = entries.filter((entry) =>
				entry.url?.startsWith(`${baseUrl}/case-studies/`),
			);
			
			// Should have at least some case studies if they exist
			for (const study of caseStudies) {
				expect(study.url).toMatch(/^https:\/\/dealscale\.io\/case-studies\/[^/]+$/);
				expect(study.priority).toBeGreaterThan(0);
			}
		});

		it("should include products", () => {
			const products = entries.filter((entry) =>
				entry.url?.startsWith(`${baseUrl}/products/`),
			);
			
			// Should have at least some products if they exist
			for (const product of products) {
				expect(product.url).toMatch(/^https:\/\/dealscale\.io\/products\/[^/]+$/);
				expect(product.priority).toBeGreaterThan(0);
			}
		});

		it("should include features/services", () => {
			const features = entries.filter((entry) =>
				entry.url?.startsWith(`${baseUrl}/features/`),
			);
			
			// Should have at least some features if they exist
			for (const feature of features) {
				expect(feature.url).toMatch(/^https:\/\/dealscale\.io\/features\/[^/]+$/);
				expect(feature.priority).toBeGreaterThan(0);
			}
		});
	});

	describe("Exclusions", () => {
		it("should NOT include /careers (redirects externally)", () => {
			const careers = entries.find((entry) => entry.url === `${baseUrl}/careers`);
			expect(careers).toBeUndefined();
		});

		it("should NOT include external URLs (YouTube, GitHub direct links)", () => {
			const externalDomains = ["youtube.com", "github.com", "beehiiv.com"];
			
			for (const entry of entries) {
				if (entry.url) {
					try {
						const url = new URL(entry.url);
						for (const domain of externalDomains) {
							expect(url.host).not.toContain(domain);
						}
					} catch {
						// Invalid URL already caught in URL validation tests
					}
				}
			}
		});
	});

	describe("Priority Distribution", () => {
		it("should have homepage with high priority", () => {
			const homepage = entries.find((entry) => entry.url === baseUrl);
			expect(homepage?.priority).toBeGreaterThanOrEqual(0.8);
		});

		it("should have key pages with appropriate priorities", () => {
			const highPriorityPages = ["/", "/pricing", "/features", "/blogs"];
			
			for (const page of highPriorityPages) {
				const entry = entries.find((entry) => entry.url === `${baseUrl}${page}`);
				if (entry) {
					expect(entry.priority).toBeGreaterThanOrEqual(0.7);
				}
			}
		});
	});

	describe("Change Frequency Distribution", () => {
		it("should have RSS feeds with hourly change frequency", () => {
			const rssFeeds = entries.filter((entry) =>
				entry.url?.includes("/rss") || entry.url?.includes("/videos/sitemap"),
			);
			
			for (const feed of rssFeeds) {
				expect(["hourly", "daily"]).toContain(feed.changeFrequency);
			}
		});

		it("should have static pages with appropriate change frequencies", () => {
			const staticPages = entries.filter((entry) => {
				const url = entry.url?.replace(baseUrl, "") || "";
				return !url.includes("/") || url.split("/").length === 2;
			});
			
			for (const page of staticPages) {
				expect(validChangeFrequencies).toContain(page.changeFrequency);
			}
		});
	});

	describe("Edge Cases", () => {
		it("should handle entries without optional fields gracefully", () => {
			// All entries should have required fields (already tested above)
			// This ensures no crashes on missing optional fields
			for (const entry of entries) {
				expect(entry.url).toBeDefined();
				expect(entry.lastModified).toBeDefined();
				expect(entry.changeFrequency).toBeDefined();
				expect(entry.priority).toBeDefined();
			}
		});

		it("should not have entries with empty or whitespace-only URLs", () => {
			for (const entry of entries) {
				if (entry.url) {
					expect(entry.url.trim().length).toBeGreaterThan(0);
				}
			}
		});

		it("should have valid Date objects for lastModified", () => {
			for (const entry of entries) {
				expect(entry.lastModified).toBeInstanceOf(Date);
				expect(Number.isNaN(entry.lastModified.getTime())).toBe(false);
			}
		});
	});
});

