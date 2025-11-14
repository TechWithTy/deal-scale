import type { HeroSocialProof } from "../types/social-proof";

export const DEFAULT_HERO_SOCIAL_PROOF: HeroSocialProof = {
	avatars: [
		{
			imageUrl: "https://i.pravatar.cc/80?img=32",
			profileUrl: "https://www.linkedin.com/company/dealscale/",
		},
		{
			imageUrl: "https://i.pravatar.cc/80?img=48",
			profileUrl: "https://www.linkedin.com/company/dealscale/",
		},
		{
			imageUrl: "https://i.pravatar.cc/80?img=12",
			profileUrl: "https://www.linkedin.com/company/dealscale/",
		},
		{
			imageUrl: "https://i.pravatar.cc/80?img=56",
			profileUrl: "https://www.linkedin.com/company/dealscale/",
		},
	],
	numPeople: 200,
	// caption: "Reusable hero experiences adopted by DealScale builders.",
	reviews: [
		{
			title: "Elena • Broker",
			subtitle: "Closed 12 deals last quarter",
			quote: "DealScale keeps every follow-up on pace.",
			rating: 5,
		},
		{
			title: "Marcus • Team Lead",
			subtitle: "ISA team of 6",
			quote: "The automations rescued 8 hours a week.",
			rating: 4,
		},
		{
			title: "Priya • Investor",
			quote: "Pipeline updates finally feel effortless.",
			rating: 5,
		},
	],
};
