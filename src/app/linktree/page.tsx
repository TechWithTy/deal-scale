import { LinkTree } from "@/components/linktree/LinkTree";
import { buildLinkTreeItemListSchema } from "@/lib/linktree/schemaBuilders";
import type { LinkTreeItem } from "@/utils/linktree-redis";
import { withUtm } from "@/utils/linktree-redis";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/linktree");
	const baseUrl = seo.canonical || "https://dealscale.io/linktree";

	return {
		...mapSeoMetaToMetadata(seo),
		title: "Link Tree | DealScale - Quick Access to Resources",
		description:
			"Explore DealScale's curated collection of links. Quick access to our products, services, blog posts, events, case studies, and more. Find everything you need in one place.",
		openGraph: {
			title: "DealScale Link Tree",
			description:
				"Quick access to DealScale's most important links, resources, and pages.",
			url: baseUrl,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: "DealScale Link Tree",
			description: "Quick access to DealScale's resources and pages.",
		},
	};
}

export default async function LinkTreePage() {
	// Build an absolute URL for server-side fetch to avoid URL parse errors in RSC
	const h = await headers();
	const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
	const protocol =
		h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
	const base = `${protocol}://${host}`;
	const resp = await fetch(`${base}/api/linktree`, {
		next: { tags: ["link-tree"], revalidate: 300 },
	});
	if (!resp.ok) {
		// Fail closed with empty list to avoid hard error on UI
		return (
			<LinkTree
				items={[]}
				title="Links"
				subtitle="Quick access to our most important links"
			/>
		);
	}
	const data = (await resp.json()) as { ok: boolean; items?: LinkTreeItem[] };
	const raw: LinkTreeItem[] = Array.isArray(data.items) ? data.items : [];
	// Build counted redirect hrefs with UTM parameters from Notion
	const items: LinkTreeItem[] = raw.map((it) => {
		// Pass Notion UTM values to withUtm function
		const notionUtms = {
			utm_source: it.utm_source,
			utm_medium: it.utm_medium,
			utm_campaign: it.utm_campaign,
			utm_content: it.utm_content,
			utm_term: it.utm_term,
			utm_offer: it.utm_offer,
		};
		const target = withUtm(it.destination, it.slug, notionUtms);
		const to = encodeURIComponent(target);
		const pid = it.pageId ? `&pageId=${encodeURIComponent(it.pageId)}` : "";
		const s = it.slug ? `&slug=${encodeURIComponent(it.slug)}` : "";
		return {
			...it,
			destination: `/api/redirect?to=${to}${pid}${s}`,
		};
	});

	// Build ItemList schema for SEO/discoverability
	// Use raw items (before redirect wrapping) for schema to show actual destinations
	const linkTreeSchema = buildLinkTreeItemListSchema(raw);

	return (
		<>
			<SchemaInjector schema={linkTreeSchema} />
			<LinkTree
				items={items}
				title="Links"
				subtitle="Quick access to our most important links"
			/>
		</>
	);
}
