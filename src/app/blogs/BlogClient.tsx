"use client";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { CTASection } from "@/components/common/CTASection";
import { NewsletterEmailInput } from "@/components/contact/newsletter/NewsletterEmailInput";
import Hero from "@/components/home/heros/Hero";
import { toast } from "@/components/ui/use-toast";
import { useBlogSearch } from "@/hooks/beehiiv/use-blog-search";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import type { BeehiivPost } from "@/types/behiiv";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { offerImg } from "../newsletter/NewsletterClient";

// Wrapper component to handle search params with Suspense
function BlogContent() {
	const searchParams = useSearchParams();
	const [articles, setArticles] = useState<BeehiivPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const todayUnix = Math.floor(Date.now() / 1000);
				// Debug: today in Beehiiv-style seconds
				console.log("[BlogClient] Today (unix seconds):", todayUnix);
			} catch {}
			setLoading(true);
			setError(null);
			try {
				const { getLatestBeehiivPosts } = await import(
					"@/lib/beehiiv/getPosts"
				);
				// Read pagination flags from URL
				const per_page = searchParams?.get("per_page");
				const page = searchParams?.get("page");
				const limit = searchParams?.get("limit");

				// Default per_page to 10 when missing or invalid
				const parsedPerPage = per_page ? Number(per_page) : NaN;
				const inferredPerPage = Number.isFinite(parsedPerPage) && parsedPerPage > 0
					? parsedPerPage
					: 10;
				const posts = await getLatestBeehiivPosts({
					perPage: inferredPerPage,
					page: page ? Number(page) : undefined,
					limit: limit ? Number(limit) : undefined,
				});
				try {
					console.log(
						"[BlogClient] Posts publish/displayed sample:",
						posts.slice(0, 10).map((p: any) => ({
							id: p?.id,
							title: p?.title,
							publish_date: p?.publish_date,
							published_at: p?.published_at,
							displayed_date: p?.displayed_date,
						})),
					);
				} catch {}
				setArticles(posts.slice(0, inferredPerPage));
			} catch (err: unknown) {
				console.error("Failed to load posts:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	}, [searchParams?.toString()]);

	const categories = [
		{ id: "all", name: "All Posts" },
		...Array.from(
			new Set(
				articles.flatMap((article) =>
					Array.isArray(article.content_tags)
						? article.content_tags.filter(
								(tag): tag is string => typeof tag === "string",
							)
						: [],
				),
			),
		).map((category) => ({
			id: category,
			name: category,
		})),
	];

	const { activeCategory, CategoryFilter } = useCategoryFilter(categories);

	// Add searchParams to dependencies to trigger re-filter when URL changes
	const { searchQuery, setSearchQuery, filteredPosts } = useBlogSearch(
		articles,
		activeCategory,
		searchParams?.toString(), // Add as dependency
	);

	// ! Debug: Log fetched blogs from Beehiiv publication
	useEffect(() => {
		if (Array.isArray(articles) && articles.length > 0) {
			console.log("[Beehiiv] Fetched blogs:", articles);
		}
	}, [articles]);

	if (loading) {
		return (
			<div className="flex justify-center p-8">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		toast({
			title: "Failed to load blog posts",
			description: "An error occurred while fetching articles",
			variant: "destructive",
		});
		return (
			<div className="p-4 text-red-500">
				Error loading posts. Please try again later.
			</div>
		);
	}

	return (
		<>
			<Hero
				badgeLeft="Investor Insights"
				badgeRight="AI-Powered Strategies"
				headline="Get an Unfair Advantage"
				subheadline="Join our newsletter for exclusive strategies on finding off-market deals, automating seller outreach, and getting a first look at the AI tools top investors use to build their pipelines."
				highlight="in Your Market"
				ctaVariant="form"
				ctaForm={<NewsletterEmailInput />}
				image={offerImg} // Recommend updating this image to something real estate or deal-flow related
				imageAlt="An illustration of an AI agent automatically adding appointments to a calendar"
			/>
			<div className="px-6 py-12 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<CategoryFilter />
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						<div className="lg:col-span-8">
							<BlogGrid posts={filteredPosts.length > 0 ? filteredPosts : articles} />
						</div>
						<div className="lg:col-span-4">
							<BlogSidebar posts={articles} />
						</div>
					</div>
				</div>
			</div>
			<div className="mt-12">
				<CTASection
					title="Ready to transform your business?"
					description="Get in touch with our team today"
					buttonText="Contact Us"
					href="/contact"
				/>
			</div>
		</>
	);
}

// Main Blog component with Suspense boundary
export default function Blog() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center p-8">
					<Loader2 className="h-12 w-12 animate-spin text-primary" />
				</div>
			}
		>
			<BlogContent />
		</Suspense>
	);
}
