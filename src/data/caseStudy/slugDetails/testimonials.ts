import type { Testimonial } from "@/types/testimonial";

/**
 * Testimonials surfaced on the detailed case study pages.
 * These entries should remain lightweight so they can be rendered in any layout.
 */
export const caseStudyTestimonials: Testimonial[] = [
	{
		id: 1,
		name: "Amelia Hart",
		role: "Director of Acquisitions",
		content:
			"Deal Scale helped us consolidate outreach, lead scoring, and reporting in one place. Our team closes faster because the data is already clean when it hits the pipeline.",
		problem:
			"Disjointed tooling created duplicate records and we consistently lost seller context between systems.",
		solution:
			"Centralizing the workflow with Deal Scale keeps the team aligned and lets us focus on conversations instead of cleanup.",
		rating: 5,
		company: "Northwind Property Group",
		companyLogo: "/logos/northwind.svg",
	},
	{
		id: 2,
		name: "Jordan Ellis",
		role: "Principal Investor",
		content:
			"The automated follow-up sequences are the reason we hit our quarterly goals. Sellers stay engaged without the team babysitting sequences.",
		problem:
			"Manual reminders failed whenever the team was on the road which meant motivated sellers fell through the cracks.",
		solution:
			"Automated outreach keeps prospects warm and flags the ones that need a human touch so nothing is missed.",
		rating: 4,
		company: "Ellis Acquisitions",
		companyLogo: "/logos/ellis-acquisitions.svg",
	},
	{
		id: 3,
		name: "Priya Desai",
		role: "Operations Manager",
		content:
			"Having seller activity in a single dashboard is a massive time saver. I can support the team proactively instead of reacting to surprises.",
		problem:
			"We lacked visibility into seller sentiment across channels which delayed decisions on hot opportunities.",
		solution:
			"Deal Scale surfaces channel history and intent signals so we can step in at the right moment.",
		rating: 5,
		company: "Atlas Equity Partners",
		companyLogo: "/logos/atlas-equity.svg",
	},
];
