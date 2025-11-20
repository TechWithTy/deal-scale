export type Speaker = "ai" | "lead";
export type LineStatus =
	| "idle"
	| "connecting"
	| "connected"
	| "transferring"
	| "ended"
	| "pending"
	| "speaking"
	| "scheduling"
	| "complete"
	| "transcript_ended";
export type AnimationType =
	| "fadeIn"
	| "fadeOut"
	| "highlight"
	| "pulse"
	| "none";

export interface TranscriptLine {
	id: string;
	speaker: Speaker;
	text: string;
	startTime: number; // in milliseconds
	duration: number; // in milliseconds
	status: LineStatus;
	animations: {
		type: AnimationType;
		startAt: number; // ms from line start
		duration: number; // ms
	}[];
	metadata?: {
		emotion?: "happy" | "neutral" | "concerned" | "excited" | "interested";
		emphasis?: boolean;
		// Add other metadata as needed
	};
}

export interface Transcript {
	id: string;
	title: string;
	participants: {
		ai: {
			name: string;
			subtitle: string;
			avatar?: string;
		};
		lead?: {
			name: string;
			subtitle: string;
			avatar?: string;
		};
	};
	lines: TranscriptLine[];
	totalDuration: number; // in milliseconds
	createdAt: Date;
	updatedAt: Date;
}
