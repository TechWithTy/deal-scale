import type { Transcript } from "@/types/transcript";

const now = new Date();

export const beforeTranscript: Transcript = {
	id: "voice-cloning-before-1",
	title: "Voice Cloning Demo (Before)",
	participants: {
		ai: {
			name: "Original Voice",
			subtitle: "Unprocessed Audio",
			avatar: "/avatars/Avatar.jpg",
		},
	},
	lines: [
		{
			id: "1",
			speaker: "ai",
			text: "This is the original voice before any processing. It sounds natural, but let's see if we can improve it.",
			startTime: 1000,
			duration: 6000,
			status: "pending",
			animations: [{ type: "fadeIn", startAt: 0, duration: 500 }],
			metadata: {
				emotion: "neutral",
			},
		},
	],
	totalDuration: 7000,
	createdAt: now,
	updatedAt: now,
};
