import type { BeehiivPost } from "@/types/behiiv";
import type { CaseStudy } from "@/types/case-study";
import type { FAQItem } from "@/types/faq";
import { ORGANIZATION_ID } from "@/utils/seo/schema";
import {
	buildBlogSchema,
	buildCaseStudyCreativeWorkSchema,
	buildFAQPageSchema,
} from "@/utils/seo/schema";

describe("schema builders", () => {
	const baseCaseStudy: CaseStudy = {
		id: "example",
		title: "Example Case Study",
		subtitle: "How Deal Scale increased qualified leads",
		slug: "example-case-study",
		categories: ["automation", "real-estate"],
		industries: ["real-estate"],
		copyright: {
			title: "Work with Deal Scale",
			subtitle: "Automate your pipeline",
			ctaText: "Get started",
			ctaLink: "/contact",
		},
		tags: ["AI", "Sales"],
		clientName: "Sample Client",
		clientDescription: "A high-growth real estate team.",
		featuredImage: "/images/case-study.png",
		thumbnailImage: "/images/case-study-thumb.png",
		businessChallenges: ["Manual outreach"],
		lastModified: new Date("2024-01-15T10:00:00.000Z"),
		businessOutcomes: [
			{
				title: "More Appointments",
				subtitle: "Booking rate increased with 24/7 follow-up.",
			},
		],
		solutions: ["AI nurture"],
		description: "Deal Scale automated the entire outreach workflow.",
		results: [
			{
				title: "Increase in qualified meetings",
				value: "72%",
			},
		],
	};

	it("builds a CreativeWork schema with reviews for a case study", () => {
		const canonical = "https://dealscale.io/case-studies/example-case-study";
		const related: CaseStudy[] = [
			{
				...baseCaseStudy,
				id: "related",
				slug: "related-case-study",
				title: "Related Study",
			},
		];

		const schema = buildCaseStudyCreativeWorkSchema(baseCaseStudy, {
			canonicalUrl: canonical,
			relatedCaseStudies: related,
		});

		expect(schema).toMatchObject({
			"@type": "CreativeWork",
			url: canonical,
			name: baseCaseStudy.title,
			headline: baseCaseStudy.subtitle,
			review: expect.arrayContaining([
				expect.objectContaining({
					"@type": "Review",
					name: baseCaseStudy.businessOutcomes[0]?.title,
					reviewBody: baseCaseStudy.businessOutcomes[0]?.subtitle,
				}),
				expect.objectContaining({
					name: baseCaseStudy.results[0]?.title,
					reviewBody: expect.stringContaining(
						baseCaseStudy.results[0]?.value ?? "",
					),
				}),
			]),
			isRelatedTo: [
				expect.objectContaining({
					url: "https://dealscale.io/case-studies/related-case-study",
				}),
			],
		});

		expect(schema.author).toEqual({
			"@type": "Organization",
			"@id": ORGANIZATION_ID,
			name: expect.any(String),
		});
	});

	it("builds FAQPage schema from FAQ items", () => {
		const faqs: FAQItem[] = [
			{
				question: "What is Deal Scale?",
				answer: "Deal Scale is an AI revenue engine.",
			},
			{
				question: "Do you integrate with CRMs?",
				answer: "Yes, we integrate with leading CRM platforms.",
			},
		];

		const schema = buildFAQPageSchema({
			canonicalUrl: "https://dealscale.io/features",
			name: "Deal Scale Features FAQs",
			description: "Answers to common feature questions.",
			faqs,
		});

		expect(schema).toMatchObject({
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: faqs[0]?.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: faqs[0]?.answer,
					},
				},
				{
					"@type": "Question",
					name: faqs[1]?.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: faqs[1]?.answer,
					},
				},
			],
		});
	});

	it("builds Blog schema with BlogPosting entries", () => {
		const posts: BeehiivPost[] = [
			{
				id: "1",
				title: "Scale your outbound",
				subtitle: "Tactics for real estate teams",
				web_url: "https://blog.dealscale.io/scale-outbound",
				published_at: 1700000000,
				content_tags: ["Outbound", "AI"],
				thumbnail_url: "https://cdn.dealscale.io/img1.png",
			},
			{
				id: "2",
				title: "Automate lead follow up",
				subtitle: "Playbooks that work",
				web_url: "https://blog.dealscale.io/automate-follow-up",
				published_at: 1700500000,
				content_tags: ["Automation"],
				thumbnail_url: "https://cdn.dealscale.io/img2.png",
			},
		];

		const schema = buildBlogSchema({
			canonicalUrl: "https://dealscale.io/blogs",
			name: "Deal Scale Blog",
			description: "Insights on AI-powered deal flow.",
			posts,
		});

		expect(schema).toMatchObject({
			"@type": "Blog",
			url: "https://dealscale.io/blogs",
			blogPost: expect.arrayContaining([
				expect.objectContaining({
					"@type": "BlogPosting",
					headline: posts[0]?.title,
					url: posts[0]?.web_url,
				}),
				expect.objectContaining({
					headline: posts[1]?.title,
					datePublished: expect.stringContaining("2023"),
				}),
			]),
			publisher: { "@id": ORGANIZATION_ID },
		});
	});
});
