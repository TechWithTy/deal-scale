// * Blogger API Type Definitions
// * See: https://developers.google.com/blogger/docs/3.0/reference/

export interface BloggerBlog {
	id: string;
	name: string;
	description: string;
	published: string;
	updated: string;
	url: string;
}

export interface BloggerPost {
	id: string;
	blog: { id: string };
	published: string;
	updated: string;
	url: string;
	title: string;
	content: string;
	author: { displayName: string; id?: string };
	labels?: string[];
}

export interface BloggerComment {
	id: string;
	post: { id: string };
	published: string;
	updated: string;
	content: string;
	author: { displayName: string; id?: string };
}

export interface BloggerPostList {
	items: BloggerPost[];
	nextPageToken?: string;
}

export interface BloggerCommentList {
	items: BloggerComment[];
	nextPageToken?: string;
}

export interface BloggerBlogList {
	items: BloggerBlog[];
	nextPageToken?: string;
}
