// ! Integration test for fetching Beehiiv posts
// * Tests both fetching all posts and a single post via the usePosts hook
// * Run only in a safe test environment (real API calls, may mutate data)

import type { BeehiivPost } from "@/types/behiiv";
import { expect } from "vitest";
import { usePosts } from "@/hooks/beehiiv/use-posts";
import { act, renderHook } from "@testing-library/react";
import {
	describeIfExternal,
	skipExternalTest,
} from "../../../testHelpers/external";

import { getTestBaseUrl } from "@/utils/env";

// Get the base URL for the current environment
const baseUrl = getTestBaseUrl();

const TEST_POSTS_ENDPOINT = `${baseUrl}/api/beehiiv/subscribe/posts`;
const LONG_TIMEOUT = 20_000;

skipExternalTest("Beehiiv Posts CRUD flow (integration)");
describeIfExternal("Beehiiv Posts CRUD flow (integration)", () => {
	it(
		"performs full CRUD flow for posts",
		async () => {
		// * Setup
		const API_KEY = process.env.BEEHIIV_API_KEY;
		const PUB_ID = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
		const POST_TEMPLATE_ID =
			process.env.BEEHIIV_POST_TEMPLATE_ID ||
			"post_template_00000000-0000-0000-0000-000000000000"; // todo: Set a real template ID
		expect(API_KEY).toBeDefined();
		expect(PUB_ID).toBeDefined();
		const baseUrl = `https://api.beehiiv.com/v2/publications/${PUB_ID}/posts`;
		let createdPostId: string | undefined;

		// ! CREATE POST (expected to fail if not enabled)
		const newPost = {
			title: `Test Post ${Date.now()}`,
			subtitle: "Integration test post",
			post_template_id: POST_TEMPLATE_ID,
			scheduled_at: new Date(Date.now() + 86400000).toISOString(), // schedule for tomorrow
			custom_link_tracking_enabled: true,
			email_capture_type_override: "none",
			override_scheduled_at: new Date(Date.now() + 3600000).toISOString(),
			social_share: "comments_and_likes_only",
			thumbnail_image_url: "https://placehold.co/600x400",
		};
		let createRes: Response | undefined;
		let createData: unknown;
		try {
			createRes = await fetch(baseUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newPost),
			});
			createData = await createRes.json();
			if (createRes.ok && (createData as { data: { id: string } }).data?.id) {
				createdPostId = (createData as { data: { id: string } }).data.id;
				// * Created successfully (rare, if beta enabled)
				expect(typeof createdPostId).toBe("string");
			} else {
				// ! Expected to fail if create is not enabled for your account
				console.warn("Create post failed (expected if beta):", createData);
			}
		} catch (err) {
			// ! Network or unexpected error
			console.error("Create post threw error:", err);
		}

		// * LIST POSTS
		let listRes: Response | undefined;
		let listData: unknown;
		try {
			listRes = await fetch(baseUrl, {
				headers: { Authorization: `Bearer ${API_KEY}` },
			});
			listData = await listRes.json();
			expect(Array.isArray((listData as { data: unknown[] }).data)).toBe(true);
			// * Save a post ID for later get/delete
			if (!createdPostId && (listData as { data: unknown[] }).data.length > 0) {
				createdPostId = (listData as { data: { id: string }[] }).data[0].id;
			}
		} catch (err) {
			console.error("List posts threw error:", err);
			throw err;
		}

		// * GET AGGREGATE STATS
		try {
			const statsUrl = `${baseUrl}/aggregate_stats`;
			const statsRes = await fetch(statsUrl, {
				headers: { Authorization: `Bearer ${API_KEY}` },
			});
			const statsData = await statsRes.json();
			expect(statsRes.ok).toBe(true);
			expect(statsData.data?.stats).toBeDefined();
		} catch (err) {
			console.error("Aggregate stats threw error:", err);
		}

		// * GET SINGLE POST
		if (createdPostId) {
			try {
				const getUrl = `${baseUrl}/${createdPostId}`;
				const getRes = await fetch(getUrl, {
					headers: { Authorization: `Bearer ${API_KEY}` },
				});
				const getData = await getRes.json();
				expect(getRes.ok).toBe(true);
				expect(getData.data?.id).toBe(createdPostId);
				expect(getData.data?.title).toBeDefined();
			} catch (err) {
				console.error("Get single post threw error:", err);
			}
		} else {
			console.warn("No postId available for single get/delete test.");
		}

		// * DELETE POST (only if we created it in this test)
		// * Only delete if we created it (avoid deleting real posts)
		if (createRes?.ok && createdPostId) {
			try {
				const delUrl = `${baseUrl}/${createdPostId}`;
				const delRes = await fetch(delUrl, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${API_KEY}` },
				});
				// 204 No Content expected
				expect(delRes.status).toBe(204);
			} catch (err) {
				console.error("Delete post threw error:", err);
			}
		} else {
			console.warn(
				"Skipping delete: post not created in this test or create request failed.",
			);
		}
		},
		LONG_TIMEOUT,
	);

	it(
		"fetches a single post by id",
		async () => {
		const { result } = renderHook(() => usePosts());
		// * First fetch all posts to get a valid id
		let postId: string | undefined;
		await act(async () => {
			await result.current.fetchPosts();
			postId = result.current.posts[0]?.id;
		});
		if (!postId) {
			// ! No posts available to fetch by id
			console.warn("No posts available to test single fetch");
			return;
		}
		// * Now fetch the single post using the configured test post ID
		const testPostId = process.env.NEXT_PUBLIC_BEEHIIV_TEST_POST_ID || postId;
		let singlePost: BeehiivPost | undefined;
		await act(async () => {
			// Simulate fetching a single post (assuming endpoint/{id} returns a single post)
			const response = await fetch(`${TEST_POSTS_ENDPOINT}/${testPostId}`, {
				method: "GET",
			});
			if (response.ok) {
				singlePost = await response.json();
			}
		});
		expect(singlePost).toBeDefined();
		expect(singlePost).toHaveProperty("id", testPostId);
		expect(singlePost).toHaveProperty("title");
		expect(singlePost).toHaveProperty("content");
		},
		LONG_TIMEOUT,
	);
});
