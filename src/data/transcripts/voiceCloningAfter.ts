import type { Transcript } from "@/types/transcript";

const now = new Date();

export const afterTranscript: Transcript = {
	id: "voice-cloning-after-1",
	title: "Voice Cloning Demo (After)",
	participants: {
		ai: {
			name: "Cloned Voice",
			subtitle: "AI-Enhanced Audio",
			avatar: "/avatars/Avatar-2.jpg",
		},
	},
	lines: [
		{
			id: "1",
			speaker: "ai",
			text: "This is the cloned voice after processing. Notice the clarity and consistent tone. This is perfect for scalable outreach.",
			startTime: 1000,
			duration: 7000,
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "happy",
			},
		},
	],
	totalDuration: 8000,
	createdAt: now,
	updatedAt: now,
};
