// * Blogger API Client (public data only)
// ! Adding comments or creating blogs requires OAuth2, not just API key.
// * Docs: https://developers.google.com/blogger/docs/3.0/reference/

import type {
	BloggerBlog,
	BloggerBlogList,
	BloggerComment,
	BloggerCommentList,
	BloggerPost,
	BloggerPostList,
} from "./types";

const API_KEY = process.env.BLOGGER_API_KEY;
const BASE_URL = "https://www.googleapis.com/blogger/v3";

if (!API_KEY) {
	throw new Error("! BLOGGER_API_KEY not set in environment");
}

// * Fetch a blog by URL
export async function getBlogByUrl(url: string): Promise<BloggerBlog> {
	const res = await fetch(
		`${BASE_URL}/blogs/byurl?url=${encodeURIComponent(url)}&key=${API_KEY}`,
	);
	if (!res.ok) throw new Error("Failed to fetch blog");
	return res.json();
}

// * Fetch posts for a blog
export async function getPosts(
	blogId: string,
	pageToken?: string,
): Promise<BloggerPostList> {
	const params = new URLSearchParams({ key: API_KEY });
	if (pageToken) params.append("pageToken", pageToken);
	const res = await fetch(`${BASE_URL}/blogs/${blogId}/posts?${params}`);
	if (!res.ok) throw new Error("Failed to fetch posts");
	return res.json();
}

// * Fetch a single post
export async function getPost(
	blogId: string,
	postId: string,
): Promise<BloggerPost> {
	const res = await fetch(
		`${BASE_URL}/blogs/${blogId}/posts/${postId}?key=${API_KEY}`,
	);
	if (!res.ok) throw new Error("Failed to fetch post");
	return res.json();
}

// * Fetch comments for a post
export async function getComments(
	blogId: string,
	postId: string,
	pageToken?: string,
): Promise<BloggerCommentList> {
	const params = new URLSearchParams({ key: API_KEY });
	if (pageToken) params.append("pageToken", pageToken);
	const res = await fetch(
		`${BASE_URL}/blogs/${blogId}/posts/${postId}/comments?${params}`,
	);
	if (!res.ok) throw new Error("Failed to fetch comments");
	return res.json();
}

// * Utility: Fetch a blog by ID
export async function getBlogById(blogId: string): Promise<BloggerBlog> {
	const res = await fetch(`${BASE_URL}/blogs/${blogId}?key=${API_KEY}`);
	if (!res.ok) throw new Error("Failed to fetch blog by ID");
	return res.json();
}
