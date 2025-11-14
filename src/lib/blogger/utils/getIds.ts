/**
 * Extracts the blogId and postId from a Blogger post edit URL.
 * @param url - The Blogger post edit URL.
 * @returns An object with blogId and postId, or null if not matched.
 */
export function extractBloggerIds(
	url: string,
): { blogId: string; postId: string } | null {
	// Example: https://www.blogger.com/u/1/blog/post/edit/7071425658654923642/1788901363067962043?hl=en
	const regex = /blog\/post\/edit\/(\d+)\/(\d+)/;
	const match = url.match(regex);
	if (!match) return null;
	return {
		blogId: match[1],
		postId: match[2],
	};
}
