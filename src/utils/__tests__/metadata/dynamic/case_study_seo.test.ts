import type { CaseStudy } from "@/types/case-study";
import { getCaseStudySeo } from "../../../seo/seo";

describe("getCaseStudySeo", () => {
	it("returns correct SEO metadata for a case study", () => {
		const mockCaseStudy: CaseStudy = {
			id: "cs-001",
			title: "AI for Retail Optimization",
			subtitle: "Transforming retail with machine learning",
			slug: "ai-retail-optimization",
			categories: ["AI", "Machine Learning", "Retail"],
			industries: ["Retail"],
			copyright: {
				title: "AI Retail Case Study",
				subtitle: "Learn how we revolutionized retail",
				ctaText: "Get Started",
				ctaLink: "/contact",
			},
			tags: ["AI", "Machine Learning", "Retail"],
			clientName: "MegaMart",
			clientDescription: "Leading national retail chain",
			featuredImage: "https://dealscale.io/images/case-study-retail.jpg",
			thumbnailImage: "https://dealscale.io/images/case-study-retail-thumb.jpg",
			businessChallenges: ["Inventory management", "Sales forecasting"],
			lastModified: new Date("2025-04-16T12:00:00Z"),
                        howItWorks: [
                                {
                                        title: "Assess",
                                        description: "Evaluate current operations",
                                },
                                {
                                        title: "Automate",
                                        description: "Implement AI workflows",
                                },
                        ],
                        businessOutcomes: [
                                {
                                        title: "Improved Inventory",
					subtitle: "30% reduction in overstocking",
				},
				{
					title: "Increased Sales",
					subtitle: "15% boost in quarterly revenue",
				},
			],
			solutions: ["Custom AI model", "Real-time analytics dashboard"],
                        techStacks: ["Next.js", "PostgreSQL"],
			description:
				"Implemented an AI-driven system to optimize inventory and boost sales for MegaMart.",
			results: [
				{ title: "Inventory Efficiency", value: "30%" },
				{ title: "Sales Increase", value: "15%" },
			],
			featured: true,
		};

		const seo = getCaseStudySeo(mockCaseStudy);

		expect(seo.title).toBe(
			"AI for Retail Optimization | Case Study | Deal Scale",
		);
		expect(seo.description).toBe("Transforming retail with machine learning");
		expect(seo.canonical).toBe(
			"https://dealscale.io/case-studies/ai-retail-optimization",
		);
		expect(seo.image).toBe("https://dealscale.io/images/case-study-retail.jpg");
		expect(seo.type).toBe("article");
		expect(seo.datePublished).toBe(
			new Date("2025-04-16T12:00:00Z").toISOString(),
		);
		expect(seo.dateModified).toBe(
			new Date("2025-04-16T12:00:00Z").toISOString(),
		);
	});
});
