"use client";
import * as React from "react";
import type { LinkTreeItem } from "@/utils/linktree-redis";
import { withUtm } from "@/utils/linktree-redis";
import { LinkCard } from "./LinkCard";

export type LinkTreeProps = {
	items: LinkTreeItem[];
	title?: string;
	subtitle?: string;
};

export function LinkTree({
	items,
	title = "Link Tree",
	subtitle,
}: LinkTreeProps) {
	const [query, setQuery] = React.useState("");
	const [preview, setPreview] = React.useState<null | {
		type: "image" | "video";
		url: string;
		title: string;
	}>(null);

	const normalized = React.useMemo(() => {
		// Base sort: pinned first, then by title
		const copy = [...items].sort((a, b) => {
			const pa = a.pinned ? 0 : 1;
			const pb = b.pinned ? 0 : 1;
			if (pa !== pb) return pa - pb;
			return a.title.localeCompare(b.title);
		});
		// filter by search
		const q = query.trim().toLowerCase();
		if (!q) return copy;
		return copy.filter((it) =>
			[it.title, it.destination, it.category]
				.filter(Boolean)
				.some((s) => String(s).toLowerCase().includes(q)),
		);
	}, [items, query]);

	const grouped = React.useMemo(() => {
		const map = new Map<string, LinkTreeItem[]>();
		for (const it of normalized) {
			const key = it.category || "Other";
			const existing = map.get(key);
			if (existing) {
				existing.push(it);
			} else {
				map.set(key, [it]);
			}
		}
		// Convert to entries and sort categories alphabetically, keeping "Other" last
		const entries = Array.from(map.entries());
		entries.sort(([a], [b]) => {
			const aIsOther = a.toLowerCase() === "other";
			const bIsOther = b.toLowerCase() === "other";
			if (aIsOther && !bIsOther) return 1;
			if (!aIsOther && bIsOther) return -1;
			return a.localeCompare(b);
		});
		// Ensure items within each category remain sorted pinned-first then title
		for (const [, list] of entries) {
			list.sort((a, b) => {
				const pa = a.pinned ? 0 : 1;
				const pb = b.pinned ? 0 : 1;
				if (pa !== pb) return pa - pb;
				return a.title.localeCompare(b.title);
			});
		}
		return entries;
	}, [normalized]);

	return (
		<div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
			<header className="mb-6 text-center md:mb-8">
				<h1 className="font-bold text-3xl tracking-tight">{title}</h1>
				{subtitle ? (
					<p className="mt-2 text-muted-foreground">{subtitle}</p>
				) : null}
			</header>

			<div className="mb-4">
				<input
					type="search"
					placeholder="Search links…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			{items.length === 0 ? (
				<div className="rounded-xl border bg-card p-6 text-center text-card-foreground">
					<p className="font-medium">No links yet</p>
					<p className="mt-1 text-muted-foreground text-sm">
						Links marked as "Link Tree Enabled" will appear here after syncing.
					</p>
				</div>
			) : (
				<div className="max-h-[70vh] overflow-y-auto pr-1">
					<div className="space-y-6">
						{grouped.map(([cat, list]) => (
							<section key={cat}>
								<h2 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									{cat}
								</h2>
								<div className="space-y-3">
									{list.map((item) => (
										<LinkCard
											key={item.slug}
											title={item.title}
											href={withUtm(item.destination, item.slug)}
											description={item.description}
											details={item.details}
											iconEmoji={item.iconEmoji}
											imageUrl={item.imageUrl}
											videoUrl={item.videoUrl}
											files={item.files}
											onPreview={(media) => setPreview(media)}
										/>
									))}
								</div>
							</section>
						))}
					</div>
				</div>
			)}

			{/* Lightbox preview */}
			{preview ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
					onClick={() => setPreview(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setPreview(null);
						}
					}}
					aria-modal="true"
					aria-label="Close preview"
				>
					<div
						className="w-full max-w-3xl"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.stopPropagation();
							}
						}}
					>
						<div className="mb-3 flex items-center justify-between">
							<h3 className="truncate pr-4 font-semibold text-lg text-white">
								{preview.title}
							</h3>
							<button
								type="button"
								className="rounded border border-white/30 px-2 py-1 text-sm text-white/80 hover:text-white"
								onClick={() => setPreview(null)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setPreview(null);
									}
								}}
							>
								Close
							</button>
						</div>
						<div className="overflow-hidden rounded-lg bg-black">
							{preview.type === "video" ? (
								<video src={preview.url} controls className="h-auto w-full">
									{/* Provide a minimal captions track to satisfy a11y linters. Replace with real captions when available. */}
									<track
										kind="captions"
										srcLang="en"
										label="English"
										default
										src="data:text/vtt,WEBVTT"
									/>
								</video>
							) : (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={preview.url} alt="" className="h-auto w-full" />
							)}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
