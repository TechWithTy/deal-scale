import type { FeatureRequest } from "@/components/features/types";
import { X } from "lucide-react";

const mockFeatures: FeatureRequest[] = [
	{
		id: "1",
		title: "Integrated E-Signatures",
		description:
			"Go from conversation to contract seamlessly. Send, sign, and manage purchase agreements and other documents directly within the Deal Scale platform to close deals faster.",
		status: "planned",
		upvotes: 68,
		created_at: "2025-06-10T12:30:00Z",
		userVote: null,
		iconIndex: 0, // Lightbulb
	},
	{
		id: "2",
		title: "AI-Generated Virtual Tours",
		description:
			"Instantly create or request immersive virtual tours for properties you're interested in. Pre-qualify homes and assess condition without ever leaving your desk.",
		status: "planned",
		upvotes: 45,
		created_at: "2025-06-05T09:15:00Z",
		userVote: null,
		iconIndex: 1, // Rocket
	},
	{
		id: "3",
		title: "Live 'Chat With Tourer' Feature",
		description:
			"Get real-time insights from the ground. Connect instantly with an on-site agent or 'tourer' to get live photos, video, and answers about a property's condition.",
		status: "under review",
		upvotes: 25,
		created_at: "2025-05-28T16:45:00Z",
		userVote: null,
		iconIndex: 2, // Star
	},
	{
		id: "4",
		title: "Seamless CRM Integration",
		description:
			"Automatically sync all qualified appointments, lead data, and conversation notes to your existing CRM (Podio, Salesforce, etc.) to keep your workflow unified.",
		status: "released",
		upvotes: 85,
		created_at: "2025-04-20T14:20:00Z",
		userVote: null,
		iconIndex: 3, // Zap
	},
	{
		id: "5",
		title: "Interactive Chat-Based Campaigns",
		description:
			"Start and manage marketing or sales campaigns directly from an interactive chat interface. Leverage AI-driven automation to create, track, and optimize campaigns in real time within Deal Scale.",
		status: "open",
		upvotes: 0,
		created_at: "2025-06-15T10:00:00Z",
		userVote: null,
		iconIndex: 4, // Heart
	},
];

export default mockFeatures;
