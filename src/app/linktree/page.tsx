import { LinkTree } from "@/components/linktree/LinkTree";
import type { LinkTreeItem } from "@/utils/linktree-redis";

export default async function LinkTreePage() {
	const base =
		process.env.NEXT_PUBLIC_SITE_URL ||
		(process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000");
	const resp = await fetch(`${base}/api/linktree`, {
		next: { tags: ["link-tree"], revalidate: 300 },
		// Ensures we leverage Next.js caching; the webhook will revalidate via tag
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
