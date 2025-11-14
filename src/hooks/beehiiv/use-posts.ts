import type { AggregateStats, BeehiivPost } from "@/types/behiiv";
import { useEffect, useState } from "react";

// * Utility: get base API URL for posts
function getPostsBaseUrl(): string {
	const PUB_ID = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
	if (!PUB_ID) throw new Error("Beehiiv publication ID is not set");
	return `https://api.beehiiv.com/v2/publications/${PUB_ID}/posts`;
}

export function usePosts(initialPosts?: BeehiivPost[]) {
	const [posts, setPosts] = useState<BeehiivPost[]>(initialPosts || []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// * List all posts
	const fetchPosts = async (): Promise<void> => {
		setLoading(true);
		try {
			const url = getPostsBaseUrl();
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
			});
			if (!response.ok) throw new Error("Failed to fetch posts");
			const data = await response.json();
			setPosts(data.data || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	// * Get a single post by ID
	const getPost = async (postId: string): Promise<BeehiivPost | null> => {
		setLoading(true);
		try {
			const url = `${getPostsBaseUrl()}/${postId}`;
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
			});
			if (!response.ok) throw new Error("Failed to fetch post");
			const data = await response.json();
			return data.data || null;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// * Get aggregate stats for all posts
	const getAggregateStats = async (): Promise<AggregateStats | null> => {
		setLoading(true);
		try {
			const url = `${getPostsBaseUrl()}/aggregate_stats`;
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
			});
			if (!response.ok) throw new Error("Failed to fetch aggregate stats");
			const data = await response.json();
			return data.data || null;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// ! Create post (expected to fail unless beta enabled)
	const createPost = async (
		newPost: Partial<BeehiivPost> & { post_template_id: string },
	): Promise<BeehiivPost | null> => {
		setLoading(true);
		try {
			const url = getPostsBaseUrl();
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
				body: JSON.stringify(newPost),
			});
			const data = await response.json();
			if (!response.ok) {
				setError(data?.error || "Failed to create post");
				// ! Most users will see an error here (beta)
				return null;
			}
			setPosts((prev) => [...prev, data.data]);
			return data.data;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// todo: Update post (not documented in Beehiiv public API, placeholder)
	const updatePost = async (
		id: string,
		updates: Partial<BeehiivPost>,
	): Promise<BeehiivPost | null> => {
		setLoading(true);
		try {
			const url = `${getPostsBaseUrl()}/${id}`;
			const response = await fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
				body: JSON.stringify(updates),
			});
			const data = await response.json();
			if (!response.ok) {
				setError(data?.error || "Failed to update post");
				return null;
			}
			setPosts((prev) =>
				prev.map((post) => (post.id === id ? data.data : post)),
			);
			return data.data;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// * Delete post
	const deletePost = async (id: string): Promise<boolean> => {
		setLoading(true);
		try {
			const url = `${getPostsBaseUrl()}/${id}`;
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
			});
			if (response.status === 204) {
				setPosts((prev) => prev.filter((post) => post.id !== id));
				return true;
			}
			setError("Failed to delete post");
			return false;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			return false;
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// * Auto-fetch on mount (optional, can remove if not wanted)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchPosts();
		// todo: Consider dependency array if you want to refetch on pubId change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		posts,
		loading,
		error,
		fetchPosts, // List all posts
		getPost, // Get by ID
		getAggregateStats, // Aggregate stats
		createPost, // Create
		updatePost, // Update (placeholder)
		deletePost, // Delete
	};
}
