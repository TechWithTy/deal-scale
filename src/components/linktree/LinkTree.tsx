"use client";
import type { LinkTreeItem } from "@/utils/linktree-redis";
import * as React from "react";
import { LinkCard } from "./LinkCard";
import { groupItems } from "./tree/grouping";
import { resolveLink } from "./tree/linkResolution";

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
	const [clientItems, setClientItems] = React.useState<LinkTreeItem[] | null>(
		null,
	);
	const displayItems = clientItems ?? items;

	// Client-side fallback: if server-rendered items are stale/short, hydrate from API
	React.useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/linktree", { cache: "no-store" });
				if (!res.ok) return;
				const data = await res.json();
				const apiItems: LinkTreeItem[] = Array.isArray(data?.items)
					? data.items
					: Array.isArray(data)
						? data
						: [];
				if (!cancelled && apiItems.length > items.length) {
					setClientItems(apiItems);
				}
			} catch {
				// ignore network errors; SSR items remain
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [items.length]);

	const normalized = React.useMemo(() => {
		const copy = [...displayItems].sort((a, b) => {
			const ha = a.highlighted ? 0 : 1;
			const hb = b.highlighted ? 0 : 1;
			if (ha !== hb) return ha - hb;
			const pa = a.pinned ? 0 : 1;
			const pb = b.pinned ? 0 : 1;
			if (pa !== pb) return pa - pb;
			return a.title.localeCompare(b.title);
		});
		const q = query.trim().toLowerCase();
		if (!q) return copy;
		return copy.filter((it) =>
			[it.title, it.destination, it.category]
				.filter(Boolean)
				.some((s) => String(s).toLowerCase().includes(q)),
		);
	}, [displayItems, query]);

	const { highlightedLabeled, normalEntries } = React.useMemo(
		() => groupItems(normalized),
		[normalized],
	);

	async function handleRefresh() {
		try {
			setPending(true);
			await fetch("/api/linktree/revalidate", { method: "POST" });
			if (typeof window !== "undefined") window.location.reload();
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

			{displayItems.length === 0 ? (
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
						{highlightedLabeled.map(([cat, list]) => (
							<section key={`hl-${cat}`}>
								<h2 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									{cat}
								</h2>
								<div className="space-y-3">
									{list.map((item, i) => {
										const { dest, isExternal } = resolveLink(item);
										return (
											<LinkCard
												key={`${item.slug}-${item.pageId ?? i}`}
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
												openInNewTab={false}
											/>
										);
									})}
								</div>
							</section>
						))}

						{/* Normal sections after highlighted */}
						{normalEntries.map(([cat, list]) => (
							<section key={`norm-${cat}`}>
								<h2 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									{cat}
								</h2>
								<div className="space-y-3">
									{list.map((item, i) => {
										const { dest, isExternal } = resolveLink(item);
										return (
											<LinkCard
												key={`${item.slug}-${item.pageId ?? i}`}
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
											/>
										);
									})}
								</div>
							</section>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
