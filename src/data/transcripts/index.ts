import type { Transcript } from "@/types/transcript";

const now = new Date();

export const demoTranscript: Transcript = {
	id: "demo-1",
	title: "Product Demo Call",
	participants: {
		ai: {
			name: "Arvis",
			subtitle: "AI Sales Rep",
			avatar: "/avatars/Avatar.jpg",
		},
		lead: {
			name: "Bonnie",
			subtitle: "Qualified Home Seller",
			avatar: "/avatars/Customer.jpg",
		},
	},
	lines: [
		{
			id: "1",
			speaker: "ai",
			text: "Hi Bonnie, this is Arvis from Acme Corp. How are you today?",
			startTime: 1000, // 1 second
			duration: 3000, // 3 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
				emphasis: true,
			},
		},
		{
			id: "2",
			speaker: "lead",
			text: "Hi Arvis, I'm doing well, thanks for asking!",
			startTime: 4500, // 4.5 seconds
			duration: 2500, // 2.5 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
			},
		},
		{
			id: "3",
			speaker: "ai",
			text: "I'm calling about your interest in our premium subscription. Would you like to hear more about the benefits?",
			startTime: 7500, // 7.5 seconds
			duration: 4000, // 4 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
		{
			id: "4",
			speaker: "lead",
			text: "Actually, I was interested in the enterprise plan. Can you tell me more about that?",
			startTime: 12000, // 12 seconds
			duration: 3500, // 3.5 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "interested",
			},
		},
		{
			id: "5",
			speaker: "ai",
			text: "I'd be happy to! Let me transfer you to our enterprise specialist who can provide all the details.",
			startTime: 16000, // 16 seconds
			duration: 4000, // 4 seconds
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
			},
		},
		{
			id: "6",
			speaker: "ai",
			text: "Transferring you now...",
			startTime: 21000, // 21 seconds
			duration: 2000, // 2 seconds
			status: "transferring",
			animations: [{ type: "pulse", startAt: 0, duration: 2000 }],
			metadata: {
				emotion: "neutral",
			},
		},
	],
	totalDuration: 23000, // 23 seconds
	createdAt: now,
	updatedAt: now,
};

export default demoTranscript;
