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
	const [pending, setPending] = React.useState(false);
	const [preview, setPreview] = React.useState<null | {
		type: "image" | "video";
		url: string;
		title: string;
	}>(null);

	const normalized = React.useMemo(() => {
		// Base sort: highlighted first, then pinned, then by title
		const copy = [...items].sort((a, b) => {
			const ha = a.highlighted ? 0 : 1;
			const hb = b.highlighted ? 0 : 1;
			if (ha !== hb) return ha - hb;
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
		const highlightMap = new Map<string, LinkTreeItem[]>();
		const normalMap = new Map<string, LinkTreeItem[]>();

		for (const it of normalized) {
			const key = it.category || "Other";
			const target = it.highlighted ? highlightMap : normalMap;
			const list = target.get(key);
			if (list) list.push(it);
			else target.set(key, [it]);
		}

		const sortCats = (entries: Array<[string, LinkTreeItem[]]>) => {
			entries.sort(([a], [b]) => {
				const aIsOther = a.toLowerCase() === "other";
				const bIsOther = b.toLowerCase() === "other";
				if (aIsOther && !bIsOther) return 1;
				if (!aIsOther && bIsOther) return -1;
				return a.localeCompare(b);
			});
			for (const [, list] of entries) {
				list.sort((a, b) => {
					const pa = a.pinned ? 0 : 1;
					const pb = b.pinned ? 0 : 1;
					if (pa !== pb) return pa - pb;
					return a.title.localeCompare(b.title);
				});
			}
		};

		const highlightedEntries = Array.from(highlightMap.entries());
		const normalEntries = Array.from(normalMap.entries());
		sortCats(highlightedEntries);
		sortCats(normalEntries);

		// Prefix highlighted section names
		const highlightedLabeled = highlightedEntries.map(([cat, list]) => [
			`Highlighted - ${cat}`,
			list,
		] as [string, LinkTreeItem[]]);

		return { highlightedLabeled, normalEntries };
	}, [normalized]);

	// Backwards-compat for hot-reload: older chunk may still expect an array.
	// If `grouped` comes in as an array, treat it as normalEntries with no highlighted sections.
	const groups = React.useMemo(() => {
		if (Array.isArray(grouped)) {
			return { highlightedLabeled: [] as Array<[string, LinkTreeItem[]]>, normalEntries: grouped as Array<[string, LinkTreeItem[]]> };
		}
		return grouped as { highlightedLabeled: Array<[string, LinkTreeItem[]]>; normalEntries: Array<[string, LinkTreeItem[]]> };
	}, [grouped]);

	async function handleRefresh() {
		try {
			setPending(true);
			await fetch("/api/linktree/revalidate", { method: "POST" });
			// Force a client transition refresh to pull latest server data
			if (typeof window !== "undefined") {
				// Soft refresh
				window.location.reload();
			}
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="mx-auto my-20 max-w-2xl px-4 py-10">
			<header className="mb-6 md:mb-8">
				<div className="flex items-center justify-between">
					<div className="flex-1 text-center">
						<h1 className="font-bold text-3xl tracking-tight">{title}</h1>
						{subtitle ? (
							<p className="mt-2 text-muted-foreground">{subtitle}</p>
						) : null}
					</div>
					<button
						type="button"
						className="ml-4 flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent"
						onClick={handleRefresh}
						aria-label="Refresh links"
						title="Refresh links"
					>
						{pending ? (
							<svg
								className="h-4 w-4 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.778-6.778-2.121 2.121M7.343 16.657l-2.121 2.121m0-13.435 2.121 2.121M16.657 16.657l2.121 2.121" />
							</svg>
						) : (
							<svg
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path d="M4.93 4.93a10 10 0 1 1-1.414 1.414M4 10V4h6" />
							</svg>
						)}
					</button>
				</div>
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
						{/* Highlighted sections first */}
						{groups.highlightedLabeled.map(([cat, list]) => (
							<section key={`hl-${cat}`}>
								<h2 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									{cat}
								</h2>
								<div className="space-y-3">
									{list.map((item) => {
										const raw = withUtm(item.destination, item.slug);
										let dest = raw;
										const isAbsolute = /^(https?:)\/\//i.test(raw);
										const isProtoRelative = /^\/\//.test(raw);
										const isRelativePath = raw.startsWith('/');
										let isExternal = false;

										if (isAbsolute) {
											isExternal = true;
										} else if (isProtoRelative) {
											// Normalize protocol-relative URLs to https
											dest = `https:${raw}`;
											isExternal = true;
										} else if (!isRelativePath) {
											// Bare hostname or missing scheme -> treat as external and prefix https
											dest = `https://${raw}`;
											isExternal = true;
										}
										return (
											<LinkCard
												key={item.slug}
												title={item.title}
												href={dest}
												description={item.description}
												details={item.details}
												iconEmoji={item.iconEmoji}
												imageUrl={item.imageUrl}
												thumbnailUrl={item.thumbnailUrl}
												videoUrl={item.videoUrl}
												files={item.files}
												pageId={item.pageId}
												slug={item.slug}
												highlighted={item.highlighted}
												showArrow={true}
												openInNewTab={isExternal}
												onPreview={(media) => setPreview(media)}
											/>
										);
									})}
								</div>
							</section>
						))}

						{/* Normal sections after highlighted */}
						{groups.normalEntries.map(([cat, list]) => (
							<section key={cat}>
								<h2 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									{cat}
								</h2>
								<div className="space-y-3">
									{list.map((item) => {
										const raw = withUtm(item.destination, item.slug);
										let dest = raw;
										const isAbsolute = /^(https?:)\/\//i.test(raw);
										const isProtoRelative = /^\/\//.test(raw);
										const isRelativePath = raw.startsWith('/');
										let isExternal = false;

										if (isAbsolute) {
											isExternal = true;
										} else if (isProtoRelative) {
											// Normalize protocol-relative URLs to https
											dest = `https:${raw}`;
											isExternal = true;
										} else if (!isRelativePath) {
											// Bare hostname or missing scheme -> treat as external and prefix https
											dest = `https://${raw}`;
											isExternal = true;
										}
										return (
											<LinkCard
												key={item.slug}
												title={item.title}
												href={dest}
												description={item.description}
												details={item.details}
												iconEmoji={item.iconEmoji}
												imageUrl={item.imageUrl}
												thumbnailUrl={item.thumbnailUrl}
												videoUrl={item.videoUrl}
												files={item.files}
												pageId={item.pageId}
												slug={item.slug}
												highlighted={item.highlighted}
												showArrow={true}
												openInNewTab={isExternal}
												onPreview={(media) => setPreview(media)}
											/>
										);
									})}
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
