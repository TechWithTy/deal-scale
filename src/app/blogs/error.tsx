"use client";
import Link from "next/link";

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="container max-w-4xl p-6">
			<h2 className="mb-4 font-bold text-2xl">Unable to Load Blog Post</h2>
			<p className="mb-6 text-muted-foreground">
				We couldn't load this blog post. Please try again or browse other posts.
			</p>
			<div className="flex gap-4">
				<button
					type="button"
					onClick={() => reset()}
					className="rounded bg-primary px-4 py-2 text-black transition-colors hover:bg-primary-dark dark:text-white"
				>
					Try Again
				</button>
				<Link
					href="/blogs"
					className="rounded border border-primary px-4 py-2 text-primary transition-colors hover:bg-primary/10"
				>
					Back to All Posts
				</Link>
			</div>
		</div>
	);
}
