export interface Event {
        id: string;
        slug?: string;
        title: string;
        date: string; // ISO date string
	time: string;
	description: string;
	thumbnailImage?: string;
	externalUrl: string;
	youtubeUrl?: string;
	category: string;
	location: string;
	isFeatured?: boolean;
}
