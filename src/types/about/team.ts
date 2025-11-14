export type TeamMember = {
	name: string;
	role: string;
	photoUrl: string;
	joined: string; // ISO date string or "Month YYYY"
	expertise: string[];
	bio: string;
	linkedin?: string;
};
