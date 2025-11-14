export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	link: string;
	categories: string[];
	description: string; // HTML string
	content: string; // HTML string for full blog post
	published: string; // ISO date format
	excerpt?: string;
	image?: string;
	readTime?: string;
	category?: string;
	author?: {
		name: string;
		image: string;
		role?: string;
	};
	tags?: string[];
}

export interface BlogState {
	posts: BlogPost[];
	selectedPost: BlogPost | null;
}
