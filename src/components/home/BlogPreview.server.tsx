import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import type { BeehiivPost } from "@/types/behiiv";
import { BlogPreview } from "./BlogPreview";

export async function BlogPreviewServer() {
	const posts = await getLatestBeehiivPosts();
	return <BlogPreview title="Latest Blogs" posts={posts} />;
}
