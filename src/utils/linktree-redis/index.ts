import { Redis } from "@upstash/redis";

export type FileMeta = {
	name: string;
	url: string;
	kind?: "image" | "video" | "other";
	ext?: string;
	expiry?: string;
};

export type LinkTreeItem = {
	pageId?: string;
	slug: string;
	title: string;
	destination: string;
	description?: string;
	details?: string;
	iconEmoji?: string;
	linkTreeEnabled?: boolean;
	imageUrl?: string;
	thumbnailUrl?: string;
	category?: string;
	pinned?: boolean;
	videoUrl?: string;
	files?: FileMeta[];
	highlighted?: boolean;
	// Derived from Notion 'Redirect Type' single select: External => true
	redirectExternal?: boolean;
};

function coerceBool(v: unknown): boolean {
	if (typeof v === "boolean") return v;
	if (typeof v === "string") return v.toLowerCase() === "true";
	if (typeof v === "number") return v !== 0;
	return false;
}

async function fetchFromRedis(): Promise<LinkTreeItem[]> {
	const redis = Redis.fromEnv();
	const keys = await redis.keys("campaign:*");
	const items: LinkTreeItem[] = [];

	for (const key of keys) {
		const slug = key.replace("campaign:", "");
		const data = await redis.hgetall<Record<string, unknown>>(key);
		if (!data) continue;
		const enabled = coerceBool((data as any).linkTreeEnabled);
		if (!enabled) continue;

		const destination = String((data as any).destination ?? "");
		if (!destination) continue;

		const title = (data as any).title ? String((data as any).title) : slug;
		const description = (data as any).description
			? String((data as any).description)
			: undefined;
		const details = (data as any).details
			? String((data as any).details)
			: undefined;
		const iconEmoji = (data as any).iconEmoji
			? String((data as any).iconEmoji)
			: undefined;
		let imageUrl = (data as any).imageUrl
			? String((data as any).imageUrl)
			: undefined;
		const category = (data as any).category
			? String((data as any).category)
			: undefined;
		const pinned = coerceBool((data as any).pinned);
		let videoUrl = (data as any).videoUrl
			? String((data as any).videoUrl)
			: undefined;
		let files: FileMeta[] | undefined;
		const filesRaw = (data as any).files;
		if (Array.isArray(filesRaw)) {
			files = filesRaw as FileMeta[];
		} else if (typeof filesRaw === "string") {
			try {
				files = JSON.parse(filesRaw) as FileMeta[];
			} catch {
				/* ignore */
			}
		}
		// derive fallbacks from files
		if (!imageUrl && files && files.length) {
			const firstImage =
				files.find((f) => f.kind === "image") ||
				files.find((f) =>
					(f.ext ?? "").match(/^(jpg|jpeg|png|gif|webp|avif|svg)$/i),
				);
			if (firstImage) imageUrl = firstImage.url;
		}
		if (!videoUrl && files && files.length) {
			const firstVideo =
				files.find((f) => f.kind === "video") ||
				files.find((f) => (f.ext ?? "").match(/^(mp4|webm|ogg|mov|m4v)$/i));
			if (firstVideo) videoUrl = firstVideo.url;
		}

		items.push({
			slug,
			title,
			destination,
			description,
			details,
			iconEmoji,
			imageUrl,
			category,
			pinned,
			videoUrl,
			files,
			linkTreeEnabled: true,
			redirectExternal: false,
		});
	}

	return items;
}

async function fetchFromNotion(): Promise<LinkTreeItem[]> {
	const NOTION_API_KEY = process.env.NOTION_KEY;
	const NOTION_DB = process.env.NOTION_REDIRECTS_ID;
	if (!NOTION_API_KEY || !NOTION_DB) return [];

	const resp = await fetch(
		`https://api.notion.com/v1/databases/${NOTION_DB}/query`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${NOTION_API_KEY}`,
				"Notion-Version": "2022-06-28",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ page_size: 100 }),
			// Edge note: keep simple for server runtime
		},
	);
	if (!resp.ok) return [];
	const data = await resp.json();

	const sanitize = (s: string | undefined): string =>
		(s ?? "")
			.replace(/\uFEFF/g, "")
			.replace(/\u00A0/g, " ")
			.trim();
	const kebab = (s: string): string =>
		`/${s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")}`;

	const readRichText = (prop: any): string | undefined => {
		try {
			if (!prop) return undefined;
			if (prop.type === "rich_text") {
				const arr =
					(prop.rich_text as Array<{ plain_text?: string }> | undefined) ?? [];
				const joined = arr
					.map((t) => t.plain_text ?? "")
					.join("")
					.trim();
				return joined || undefined;
			}
			if (prop.type === "title") {
				const arr =
					(prop.title as Array<{ plain_text?: string }> | undefined) ?? [];
				const joined = arr
					.map((t) => t.plain_text ?? "")
					.join("")
					.trim();
				return joined || undefined;
			}
			if (prop.type === "url") return (prop.url as string | undefined)?.trim();
			return undefined;
		} catch {
			return undefined;
		}
	};

	const results: LinkTreeItem[] = [];
	for (const page of data.results ?? []) {
		const props = page.properties ?? {};
		let slug = readRichText((props as any)?.Slug);
		let destination = readRichText((props as any)?.Destination);
		if (destination && destination.trim().toLowerCase() === "none")
			destination = "";
		const titleFromTitle = readRichText((props as any)?.Title);
		const title = titleFromTitle || slug || "";
		// Fallback: derive slug from Title when Slug is absent
		if (!slug && titleFromTitle) {
			const t = sanitize(titleFromTitle);
			if (t.startsWith("/")) {
				// Use first token if spaces exist (Notion titles sometimes have descriptions)
				slug = t.split(/\s+/)[0];
			}
		}
		// Fallback: derive slug from Destination when it's an internal path
		if (!slug && typeof destination === "string") {
			const d = sanitize(destination);
			if (d.startsWith("/")) {
				slug = d.split(/[?#]/)[0];
			}
		}
		// Last resort: derive from Title by kebab-case
		if (!slug && titleFromTitle) {
			slug = kebab(titleFromTitle);
		}
		const description =
			readRichText((props as any)?.Description) ??
			readRichText((props as any)?.Desc);
		const details =
			readRichText((props as any)?.Details) ??
			readRichText((props as any)?.Detail);
		const iconEmoji = page?.icon?.emoji as string | undefined;

		// Image from explicit props or cover
		let imageUrl: string | undefined;
		const imageProp = (props as any)?.Image || (props as any)?.Thumbnail;
		if (imageProp?.type === "url")
			imageUrl = imageProp.url as string | undefined;
		if (!imageUrl && imageProp?.type === "rich_text")
			imageUrl = imageProp.rich_text?.[0]?.plain_text as string | undefined;
		if (!imageUrl && (page as any)?.cover?.external?.url)
			imageUrl = (page as any).cover.external.url as string;

		// Link Tree Enabled can be a checkbox or a select with values like "True"/"Yes"/"Enabled"
		let linkTreeEnabled = false;
		const lte = props?.["Link Tree Enabled"] as any;
		if (lte?.type === "checkbox") {
			linkTreeEnabled = Boolean(lte.checkbox);
		} else if (lte?.type === "select") {
			const name = (lte.select?.name ?? "").toString().toLowerCase();
			linkTreeEnabled = name === "true" || name === "yes" || name === "enabled";
		} else if (lte?.type === "status" && lte.status?.name) {
			const name = (lte.status.name ?? "").toString().toLowerCase();
			linkTreeEnabled = name === "true" || name === "yes" || name === "enabled";
		} else if (lte?.type === "rich_text" || lte?.type === "title") {
			const txt = readRichText(lte) ?? "";
			const name = txt.toLowerCase();
			linkTreeEnabled = name === "true" || name === "yes" || name === "enabled";
		}
		if (!linkTreeEnabled && props?.Type?.select?.name === "LinkTree") {
			linkTreeEnabled = true;
		}

		// Optional metadata
		const category = props?.Category?.select?.name as string | undefined;
		const pinned = Boolean(
			(props?.Pinned?.checkbox as boolean | undefined) ||
				(props?.Pinned as any)?.select?.name?.toString().toLowerCase() ===
					"true",
		);
		// Redirect Type: Internal/External
		const redirectType = (props as any)?.["Redirect Type"]?.select?.name as
			| string
			| undefined;
		const redirectExternal =
			(redirectType ?? "").toString().toLowerCase() === "external";
		let videoUrl = (props as any)?.Video?.url as string | undefined;
		// Files (support Notion files property named "Media" or "Files")
		let files: FileMeta[] | undefined;
		const filesProp =
			(props as any)?.Media || (props as any)?.Files || (props as any)?.File;
		const inferKind = (
			nameOrUrl: string,
		): { kind: "image" | "video" | "other"; ext?: string } => {
			try {
				const m = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(nameOrUrl);
				const ext = m ? m[1].toLowerCase() : undefined;
				const img = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];
				const vid = ["mp4", "webm", "ogg", "mov", "m4v"];
				if (ext && img.includes(ext)) return { kind: "image", ext };
				if (ext && vid.includes(ext)) return { kind: "video", ext };
				return { kind: "other", ext };
			} catch {
				return { kind: "other" } as const;
			}
		};
		if (filesProp?.type === "files" && Array.isArray(filesProp.files)) {
			files = filesProp.files
				.map((f: any) => {
					if (f.type === "file") {
						const url = f.file?.url as string;
						const meta = inferKind(f.name || url);
						return {
							name: f.name as string,
							url,
							kind: meta.kind,
							ext: meta.ext,
							expiry: f.file?.expiry_time as string | undefined,
						};
					}
					if (f.type === "external") {
						const url = f.external?.url as string;
						const meta = inferKind(f.name || url);
						return {
							name: f.name as string,
							url,
							kind: meta.kind,
							ext: meta.ext,
						};
					}
					return undefined;
				})
				.filter(Boolean) as FileMeta[];
		}
		// derive fallbacks from files if explicit image/video not present
		if (!imageUrl && files && files.length) {
			const firstImage =
				files.find((f) => f.kind === "image") ||
				files.find((f) =>
					(f.ext ?? "").match(/^(jpg|jpeg|png|gif|webp|avif|svg)$/i),
				);
			if (firstImage) imageUrl = firstImage.url;
		}
		if (!videoUrl && files && files.length) {
			const firstVideo =
				files.find((f) => f.kind === "video") ||
				files.find((f) => (f.ext ?? "").match(/^(mp4|webm|ogg|mov|m4v)$/i));
			if (firstVideo) videoUrl = firstVideo.url;
		}

		const hasFiles = Array.isArray(files) && files.length > 0;
		if (slug && linkTreeEnabled && (Boolean(destination) || hasFiles)) {
			results.push({
				slug,
				title: title || slug,
				destination,
				description,
				details,
				iconEmoji,
				category,
				pinned,
				imageUrl,
				videoUrl,
				files,
				linkTreeEnabled,
				redirectExternal,
			});
		}
	}

	return results;
}

/**
 * Preferred source: Notion.
 *
 * We keep this function name for backward compatibility, but it no longer
 * reads from Redis. This avoids UI drift/staleness and centralizes LinkTree
 * as a pure Notion-driven feature. Redis usage remains for legacy callers
 * via fetchFromRedis() if explicitly invoked elsewhere.
 */
export async function fetchLinkTreeItems(): Promise<LinkTreeItem[]> {
	return fetchFromNotion();
}

export function withUtm(url: string, slug: string): string {
	try {
		const u = new URL(url, "http://dummy.base");
		// Internal path: do not alter
		if (!/^https?:/i.test(url)) return url;

		// Determine site host in a deterministic way for SSR + CSR to avoid hydration mismatches.
		// Use a single source of truth that is embedded at build time on the client.
		// Set NEXT_PUBLIC_SITE_HOST="localhost:3000" in dev, and "www.dealscale.io" in prod.
		const sourceHost = process.env.NEXT_PUBLIC_SITE_HOST || "dealscale.ai";

		// Skip UTM appending for signed/file URLs (e.g., Notion/S3 presigned URLs).
		// Adding UTM params invalidates signatures such as X-Amz-Signature.
		const host = u.hostname.toLowerCase();
		const hasSignedParams = Array.from(u.searchParams.keys()).some((k) =>
			k.toLowerCase().startsWith("x-amz-"),
		);
		const isS3 = host.endsWith("amazonaws.com");
		if (hasSignedParams || isS3) {
			return url;
		}

		if (!u.searchParams.get("utm_source"))
			u.searchParams.set("utm_source", sourceHost);
		if (!u.searchParams.get("utm_campaign"))
			u.searchParams.set("utm_campaign", slug);
		return u.toString();
	} catch {
		return url;
	}
}
