import { Project } from "@/types/projects";
import { z } from "zod";

const ProjectSchema = z
	.object({
		id: z.number(),
		title: z.string(),
		description: z.string(),
		image: z.string().url(),
		category: z.enum(["ai", "mobile", "web", "ecommerce"]),
		technologies: z.array(z.string()),
		liveUrl: z
			.object({
				url: z.string().url(),
				price: z.number().positive(),
			})
			.optional(),
		github: z.string().url().optional(),
		clientUrl: z.string().url().optional(),
		featured: z.boolean(),
	})
	.refine(
		(data) => {
			const hasLiveUrl = !!data.liveUrl;
			const hasGithub = !!data.github;
			const hasClientUrl = !!data.clientUrl;
			return (
				(hasLiveUrl ? 1 : 0) + (hasGithub ? 1 : 0) + (hasClientUrl ? 1 : 0) ===
				1
			);
		},
		{
			message: "Only one of liveUrl, github, or clientUrl must be provided",
		},
	)
	.refine(
		(data) => {
			if (data.liveUrl) {
				return !!data.liveUrl.price;
			}
			return true;
		},
		{
			message: "Price must be provided if liveUrl is present",
		},
	);

export const projects: z.infer<typeof ProjectSchema>[] = [
	{
		id: 1,
		title: "AI-Powered Healthcare Platform",
		description:
			"Analyze medical images and assist diagnoses, reducing diagnostic time by 60%.",
		image: "https://placehold.co/800x500/2D9CDB/FFFFFF/png?text=Healthcare+AI",
		category: "ai",
		technologies: ["TensorFlow", "Python", "React", "AWS"],
		liveUrl: {
			url: "https://ai-healthcare-platform.example.com",
			price: 99.99,
		},
		featured: true,
	},
	{
		id: 2,
		title: "E-Commerce Mobile App",
		description:
			"Feature-rich app with personalized recommendations and seamless payments.",
		image: "https://placehold.co/800x500/4263EB/FFFFFF/png?text=E-commerce+App",
		category: "mobile",
		technologies: ["React Native", "Node.js", "Stripe", "Firebase"],
		clientUrl: "https://ecommerce-app.example.com",
		featured: true,
	},
	{
		id: 3,
		title: "Blockchain Supply Chain Solution",
		description:
			"Ensure transparency and traceability of products using blockchain.",
		image:
			"https://placehold.co/800x500/6C63FF/FFFFFF/png?text=Blockchain+Supply",
		category: "web",
		technologies: ["Ethereum", "Solidity", "Web3.js", "React"],
		github: "https://github.com/example/blockchain-supply",
		featured: false,
	},
	{
		id: 4,
		title: "Smart City Management Dashboard",
		description: "Monitor and manage various aspects of urban infrastructure.",
		image: "https://placehold.co/800x500/3B82F6/FFFFFF/png?text=Smart+City",
		category: "web",
		technologies: ["Vue.js", "D3.js", "Express", "MongoDB"],
		liveUrl: { url: "https://smart-city.example.com", price: 149.99 },
		featured: true,
	},
	{
		id: 5,
		title: "Fashion E-Commerce Platform",
		description:
			"High-performance platform with AR try-on features and personalized shopping.",
		image: "https://placehold.co/800x500/1E40AF/FFFFFF/png?text=Fashion+Store",
		category: "ecommerce",
		technologies: ["Next.js", "Shopify", "ThreeJS", "Vercel"],
		github: "https://github.com/example/fashion-ecommerce",
		featured: false,
	},
	{
		id: 6,
		title: "Real Estate Marketplace",
		description:
			"Connect buyers, sellers, and agents with virtual tours and AI valuations.",
		image: "https://placehold.co/800x500/2D9CDB/FFFFFF/png?text=Real+Estate",
		category: "web",
		technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
		clientUrl: "https://real-estate-marketplace.example.com",
		featured: false,
	},
	{
		id: 7,
		title: "AI Content Generation Tool",
		description:
			"Generate high-quality blog posts, social media content, and marketing copy.",
		image: "https://placehold.co/800x500/6C63FF/FFFFFF/png?text=AI+Content",
		category: "ai",
		technologies: ["Python", "GPT-4", "Flask", "React"],
		liveUrl: { url: "https://ai-content-generator.example.com", price: 79.99 },
		featured: true,
	},
	{
		id: 8,
		title: "Wellness Mobile Application",
		description:
			"Meditation guides, sleep tracking, and personalized fitness recommendations.",
		image: "https://placehold.co/800x500/3B82F6/FFFFFF/png?text=Wellness+App",
		category: "mobile",
		technologies: ["React Native", "Firebase", "TensorFlow Lite", "NodeJS"],
		clientUrl: "https://wellness-app.example.com",
		featured: false,
	},
];

ProjectSchema.array().parse(projects);
