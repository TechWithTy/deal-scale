export interface MediumArticle {
	author: string;
	categories: string[];
	content: string;
	description: string;
	enclosure: Record<string, unknown>;
	guid: string;
	link: string;
	pubDate: string;
	thumbnail: string | null;
	title: string;
	subtitle: string;
	slug: string;
}

export interface InternalPost {
	title: string;
	link: string;
	categories: string[];
	content: string;
	pubDate: string;
	contentSnippet?: string;
}
