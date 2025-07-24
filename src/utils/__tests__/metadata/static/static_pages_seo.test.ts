import { staticSeoMeta } from "@/utils/seo/staticSeo";

describe("Static SEO metadata", () => {
	it("returns correct SEO metadata for Blogs page", () => {
		const seo = staticSeoMeta["/blogs"];
		expect(seo).toEqual({
			title: "Blogs | Deal Scale",
			description:
				"Explore the latest insights, stories, and updates from the Deal Scale team.",
			canonical: "https://dealscale.io/blogs",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Contact page", () => {
		const seo = staticSeoMeta["/contact"];
		expect(seo).toEqual({
			title: "Contact | Deal Scale",
			description:
				"Get in touch with Deal Scale for expert digital solutions and support.",
			canonical: "https://dealscale.io/contact",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Case Studies page", () => {
		const seo = staticSeoMeta["/case-studies"];
		expect(seo).toEqual({
			title: "Case Studies | Deal Scale",
			description:
				"Discover real-world solutions and success stories from Deal Scale clients.",
			canonical: "https://dealscale.io/case-studies",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Cookies page", () => {
		const seo = staticSeoMeta["/cookies"];
		expect(seo).toEqual({
			title: "Cookie Policy | Deal Scale",
			description:
				"Learn how Deal Scale uses cookies and manages your preferences.",
			canonical: "https://dealscale.io/cookies",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Events page", () => {
		const seo = staticSeoMeta["/events"];
		expect(seo).toEqual({
			title: "Events | Deal Scale",
			description:
				"Join Deal Scale events and stay updated on the latest in tech and innovation.",
			canonical: "https://dealscale.io/events",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for FAQs page", () => {
		const seo = staticSeoMeta["/faqs"];
		expect(seo).toEqual({
			title: "FAQs | Deal Scale",
			description:
				"Find answers to common questions about Deal Scale’s services and solutions.",
			canonical: "https://dealscale.io/faqs",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Portfolio page", () => {
		const seo = staticSeoMeta["/portfolio"];
		expect(seo).toEqual({
			title: "Portfolio | Deal Scale",
			description:
				"Explore Deal Scale’s portfolio of innovative digital projects and solutions.",
			canonical: "https://dealscale.io/portfolio",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Privacy Policy page", () => {
		const seo = staticSeoMeta["/privacy"];
		expect(seo).toEqual({
			title: "Privacy Policy | Deal Scale",
			description:
				"Read our privacy policy to learn how Deal Scale protects your data.",
			canonical: "https://dealscale.io/privacy",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Terms of Service page", () => {
		const seo = staticSeoMeta["/tos"];
		expect(seo).toEqual({
			title: "Terms of Service | Deal Scale",
			description:
				"Review the terms and conditions for using Deal Scale’s website and services.",
			canonical: "https://dealscale.io/tos",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});

	it("returns correct SEO metadata for Services page", () => {
		const seo = staticSeoMeta["/features"];
		expect(seo).toEqual({
			title: "Features | Deal Scale",
			description:
				"Browse Deal Scale’s full range of digital services for businesses and startups.",
			canonical: "https://dealscale.io/features",
			image: "https://dealscale.io/og-default.jpg",
			keywords: ["AI", "MVP", "software", "case studies", "Deal Scale"],
		});
	});
});
