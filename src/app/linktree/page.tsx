import { LinkTree } from "@/components/linktree/LinkTree";
import type { LinkTreeItem } from "@/utils/linktree-redis";
import { headers } from "next/headers";
import { withUtm } from "@/utils/linktree-redis";

export default async function LinkTreePage() {
	// Build an absolute URL for server-side fetch to avoid URL parse errors in RSC
	const h = await headers();
	const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
	const protocol = h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
	const base = `${protocol}://${host}`;
	const resp = await fetch(`${base}/api/linktree`, {
		next: { tags: ["link-tree"], revalidate: 300 },
	});
	if (!resp.ok) {
		// Fail closed with empty list to avoid hard error on UI
		return (
			<LinkTree
				items={[]}
				title="Link Tree"
				subtitle="Quick access to our most important links"
			/>
		);
	}
	const data = (await resp.json()) as { ok: boolean; items?: LinkTreeItem[] };
	const raw: LinkTreeItem[] = Array.isArray(data.items) ? data.items : [];
	// Build counted redirect hrefs
	const items: LinkTreeItem[] = raw.map((it) => {
		const target = withUtm(it.destination, it.slug);
		const to = encodeURIComponent(target);
		const pid = it.pageId ? `&pageId=${encodeURIComponent(it.pageId)}` : "";
		const s = it.slug ? `&slug=${encodeURIComponent(it.slug)}` : "";
		return {
			...it,
			destination: `/api/redirect?to=${to}${pid}${s}`,
		};
	});
	return (
		<LinkTree
			items={items}
			title="Link Tree"
			subtitle="Quick access to our most important links"
		/>
	);
}
