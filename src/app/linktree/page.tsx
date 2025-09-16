import { LinkTree } from "@/components/linktree/LinkTree";
import type { LinkTreeItem } from "@/utils/linktree-redis";
import { headers } from "next/headers";

export default async function LinkTreePage() {
	// Build an absolute URL for server-side fetch to avoid URL parse errors in RSC
	const h = headers();
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
	const items: LinkTreeItem[] = Array.isArray(data.items) ? data.items : [];
	return (
		<LinkTree
			items={items}
			title="Link Tree"
			subtitle="Quick access to our most important links"
		/>
	);
}
