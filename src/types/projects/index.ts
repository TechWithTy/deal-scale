// In src/types/projects/index.ts
export type Project = {
	id?: number; // Made optional
	title?: string; // Made optional
	description?: string; // Made optional
	image?: string; // Made optional
	category?: string; // Made optional
	technologies?: string[]; // Made optional
	liveUrl?: {
		url?: string; // Made optional
		price?: number;
	};
	github?: string;
	clientUrl?: string;
	featured?: boolean; // Made optional
};
