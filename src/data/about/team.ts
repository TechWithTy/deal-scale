import type { TeamMember } from "@/types/about/team";

export const teamMembers: TeamMember[] = [
	{
		name: "Ty D.",
		role: "Chief Technology Officer",
		photoUrl: "/company/c-suite/Ty.jpg",
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
		name: "Jackie R.",
		role: "Marketing Advisor",
		photoUrl: "/company/c-suite/ja_name_redacted.jpg",
		joined: "Founder",
		expertise: [
			"Digital Marketing",
			"Enterprise GTM Strategy",
			"Ex-Office Depot Marketing Lead",
		],
		bio: "Jackie brings 15+ years of marketing expertise, having managed over $5M in digital marketing budgets and scaled enterprise go-to-market strategies.",
		linkedin: "https://www.linkedin.com/in/jackierdaniel/", // Placeholder
	},
	{
		name: "Marco Wong",
		role: "Founding Backend DevOps Engineer",
		photoUrl: "/company/c-suite/marco.jpg", // Placeholder, replace with actual photo
		joined: "Founder",
		expertise: [
			"FastAPI & Python Services",
			"SQLModel & Postgres Architecture",
			"Cloud DevOps & Observability",
		],
		bio: "Marco designs the platform’s backend systems, blending event-driven FastAPI services with resilient DevOps pipelines so our AI agents stay reliable at scale.",
		linkedin: "https://www.linkedin.com/in/marcowong/", // Placeholder
	},
];
