import type { TeamMember } from "@/types/about/team";

export const teamMembers: TeamMember[] = [
	{
		name: "Ty D.",
		role: "Chief Technology Officer",
		photoUrl: "/company/c-suite/ty.jpg", // Placeholder, replace with actual photo
		joined: "Founder",
		expertise: [
			"Scalable AI/SaaS",
			"Software Architecture",
			"Ex-Google Engineer",
		],
		bio: "With over 10 years in software and experience as an ex-Google Engineer, Ty leads our technology, having scaled core infrastructure to handle millions of global users.",
		linkedin: "https://www.linkedin.com/in/-techwithty/", // Placeholder
	},
	{
		name: "Jackie D.",
		role: "Chief Marketing Officer",
		photoUrl:
			"https://static.wixstatic.com/media/a0bda4_73a7b89de3fb4d0aa334ae65e518756c~mv2.gif", // Placeholder, replace with actual photo
		joined: "Founder",
		expertise: [
			"Digital Marketing",
			"Enterprise GTM Strategy",
			"Ex-Office Depot Marketing Lead",
		],
		bio: "Jackie brings 15+ years of marketing expertise, having managed over $5M in digital marketing budgets and scaled enterprise go-to-market strategies.",
		linkedin: "https://www.linkedin.com/in/jackierdaniel/", // Placeholder
	},
];
