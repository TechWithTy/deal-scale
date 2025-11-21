import type { ValueItem } from "@/types/about/values";

export const values: ValueItem[] = [
	{
		title: "Innovation",
		description: "We push boundaries and embrace new ideas.",
		icon: "flame",
		details:
			"Innovation is at the heart of our culture. We constantly seek new solutions, challenge the status quo, and empower our team to experiment.",
		impactStatement:
			"Our innovative mindset delivers cutting-edge solutions that help customers stay ahead.",
		examples: [
			"Launching experimental features in beta",
			"Hosting regular hackathons",
			"Encouraging team-driven R&D projects",
		],
		highlight: true,
	},
	{
		title: "Transparency",
		description: "Openness and honesty in everything we do.",
		icon: "eye",
		details:
			"We share information freely, communicate openly with stakeholders, and value honest feedback.",
		impactStatement:
			"Transparency builds trust with our customers and partners.",
		examples: [
			"Publishing quarterly progress reports",
			"Openly discussing challenges and failures",
			"Clear communication of project timelines",
		],
		highlight: false,
	},
	{
		title: "Collaboration",
		description: "We build together, not alone.",
		icon: "users",
		details:
			"Collaboration means leveraging diverse perspectives and skills to achieve shared goals.",
		impactStatement:
			"Collaboration leads to better outcomes for our clients and our team.",
		examples: [
			"Cross-functional project teams",
			"Pair programming sessions",
			"Regular team retrospectives",
		],
		highlight: false,
	},
	{
		title: "Impact",
		description: "Focused on delivering real value.",
		icon: "target",
		details:
			"We measure our success by the positive outcomes we create for customers and communities.",
		impactStatement: "Our work makes a tangible difference for those we serve.",
		examples: [
			"Tracking customer success metrics",
			"Celebrating stories of client transformation",
			"Prioritizing features that solve real problems",
		],
		highlight: false,
	},
];
