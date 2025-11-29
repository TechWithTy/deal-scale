import { Redis } from "@upstash/redis";

export type FileMeta = {
	name: string;
	url: string;
	kind?: "image" | "video" | "other";
	ext?: string;
	expiry?: string;
};

type NotionPropertyValue =
	| { type: "rich_text"; rich_text?: Array<{ plain_text?: string }> }
	| { type: "title"; title?: Array<{ plain_text?: string }> }
	| { type: "url"; url?: string }
	| { type: "checkbox"; checkbox?: boolean }
	| { type: "select"; select?: { name?: string } }
	| { type: "status"; status?: { name?: string } }
	| { type: "files"; files?: Array<NotionFileObject> }
	| Record<string, never>; // For other property types

type NotionFileObject =
	| {
			type: "file";
			file?: { url?: string; expiry_time?: string };
			name?: string;
	  }
	| { type: "external"; external?: { url?: string }; name?: string };

type NotionPage = {
	properties?: Record<string, NotionPropertyValue>;
	icon?: { emoji?: string };
	cover?: { external?: { url?: string } };
};

type RedisCampaignData = {
	linkTreeEnabled?: unknown;
	destination?: unknown;
	title?: unknown;
	description?: unknown;
	details?: unknown;
	iconEmoji?: unknown;
	imageUrl?: unknown;
	category?: unknown;
	pinned?: unknown;
	videoUrl?: unknown;
	files?: unknown;
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
	// UTM parameters from Notion
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
	utm_offer?: string;
	// Facebook Pixel tracking fields
	facebookPixelEnabled?: boolean;
	facebookPixelSource?: string;
	facebookPixelIntent?: string;
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
		const data = await redis.hgetall<RedisCampaignData>(key);
		if (!data) continue;
		const enabled = coerceBool(data.linkTreeEnabled);
		if (!enabled) continue;

		const destination = String(data.destination ?? "");
		if (!destination) continue;

		const title = data.title ? String(data.title) : slug;
		const description = data.description ? String(data.description) : undefined;
		const details = data.details ? String(data.details) : undefined;
		const iconEmoji = data.iconEmoji ? String(data.iconEmoji) : undefined;
		let imageUrl = data.imageUrl ? String(data.imageUrl) : undefined;
		const category = data.category ? String(data.category) : undefined;
		const pinned = coerceBool(data.pinned);
		let videoUrl = data.videoUrl ? String(data.videoUrl) : undefined;
		let files: FileMeta[] | undefined;
		const filesRaw = data.files;
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

	const readRichText = (
		prop: NotionPropertyValue | undefined,
	): string | undefined => {
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

	// Type guard functions for safe property access
	const isCheckboxProperty = (
		prop: NotionPropertyValue,
	): prop is { type: "checkbox"; checkbox: boolean } => {
		return prop.type === "checkbox";
	};

	const isSelectProperty = (
		prop: NotionPropertyValue,
	): prop is { type: "select"; select: { name?: string } } => {
		return prop.type === "select";
	};

	const isUrlProperty = (
		prop: NotionPropertyValue,
	): prop is { type: "url"; url: string } => {
		return prop.type === "url";
	};

	const isFilesProperty = (
		prop: NotionPropertyValue,
	): prop is { type: "files"; files: Array<NotionFileObject> } => {
		return prop.type === "files";
	};

	const getSelectValue = (
		prop: NotionPropertyValue | undefined,
	): string | undefined => {
		if (!prop || !isSelectProperty(prop)) return undefined;
		return prop.select?.name;
	};

	const getCheckboxValue = (
		prop: NotionPropertyValue | undefined,
	): boolean | undefined => {
		if (!prop || !isCheckboxProperty(prop)) return undefined;
		return prop.checkbox;
	};

	const getUrlValue = (
		prop: NotionPropertyValue | undefined,
	): string | undefined => {
		if (!prop || !isUrlProperty(prop)) return undefined;
		return prop.url;
	};

	// Extract UTM value from Notion property (supports select and rich_text for flexibility)
	const getUtmValue = (
		prop: NotionPropertyValue | undefined,
	): string | undefined => {
		if (!prop) return undefined;
		// Try select first (most common for UTM parameters)
		if (isSelectProperty(prop)) {
			return prop.select?.name;
		}
		// Fallback to rich_text for flexibility
		if (prop.type === "rich_text" && Array.isArray(prop.rich_text)) {
			const text = prop.rich_text
				.map((t) => t.plain_text ?? "")
				.join("")
				.trim();
			return text || undefined;
		}
		return undefined;
	};

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

	const results: LinkTreeItem[] = [];
	for (const page of (data.results ?? []) as NotionPage[]) {
		const props = page.properties ?? {};
		let slug = readRichText(props?.Slug);
		let destination = readRichText(props?.Destination);
		if (destination && destination.trim().toLowerCase() === "none")
			destination = "";
		const titleFromTitle = readRichText(props?.Title);
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
			readRichText(props?.Description) ?? readRichText(props?.Desc);
		const details = readRichText(props?.Details) ?? readRichText(props?.Detail);
		const iconEmoji = page?.icon?.emoji as string | undefined;

		// Image from explicit props or cover
		let imageUrl: string | undefined;
		const imageProp = props?.Image || props?.Thumbnail;
		if (imageProp && isUrlProperty(imageProp)) {
			imageUrl = imageProp.url;
		} else if (
			imageProp &&
			(imageProp.type === "rich_text" || imageProp.type === "title")
		) {
			imageUrl = readRichText(imageProp);
		}
		if (!imageUrl && page.cover?.external?.url) {
			imageUrl = page.cover.external.url;
		}

		// Link Tree Enabled can be a checkbox or a select with values like "True"/"Yes"/"Enabled"
		let linkTreeEnabled = false;
		const lte = props?.["Link Tree Enabled"];
		if (lte) {
			if (isCheckboxProperty(lte)) {
				linkTreeEnabled = Boolean(lte.checkbox);
			} else if (
				isSelectProperty(lte) ||
				(lte.type === "status" &&
					(lte as { status?: { name?: string } }).status?.name)
			) {
				const name = isSelectProperty(lte)
					? lte.select?.name
					: (lte as { status?: { name?: string } }).status?.name;
				const nameStr = name?.toString().toLowerCase() ?? "";
				linkTreeEnabled =
					nameStr === "true" || nameStr === "yes" || nameStr === "enabled";
			} else if (lte.type === "rich_text" || lte.type === "title") {
				const txt = readRichText(lte) ?? "";
				const name = txt.toLowerCase();
				linkTreeEnabled =
					name === "true" || name === "yes" || name === "enabled";
			}
		}
		if (!linkTreeEnabled && getSelectValue(props?.Type) === "LinkTree") {
			linkTreeEnabled = true;
		}

		// Optional metadata
		const category = getSelectValue(props?.Category);
		const pinned = Boolean(
			getCheckboxValue(props?.Pinned) ||
				getSelectValue(props?.Pinned)?.toLowerCase() === "true",
		);
		// Redirect Type: Internal/External
		const redirectType = getSelectValue(props?.["Redirect Type"]);
		const redirectExternal =
			(redirectType ?? "").toString().toLowerCase() === "external";
		let videoUrl = getUrlValue(props?.Video);
		// Files (support Notion files property named "Media" or "Files")
		let files: FileMeta[] | undefined;
		const filesProp = props?.Media || props?.Files || props?.File;
		if (
			filesProp &&
			isFilesProperty(filesProp) &&
			Array.isArray(filesProp.files)
		) {
			files = filesProp.files
				.map((f: NotionFileObject) => {
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

		// Extract UTM parameters from Notion
		// Handle "UTM Campaign (Relation)" property name - use it if available, otherwise fallback to "UTM Campaign"
		const utmCampaignRelation = getUtmValue(props?.["UTM Campaign (Relation)"]);
		const utmCampaignRegular = getUtmValue(props?.["UTM Campaign"]);
		const utm_campaign = utmCampaignRelation || utmCampaignRegular;

		// Extract Facebook Pixel fields
		// Facebook Pixel Enabled can be checkbox or select
		let facebookPixelEnabled = false;
		const fbPixelEnabledProp = props?.["Facebook Pixel Enabled"];
		if (fbPixelEnabledProp) {
			if (isCheckboxProperty(fbPixelEnabledProp)) {
				facebookPixelEnabled = Boolean(fbPixelEnabledProp.checkbox);
			} else if (isSelectProperty(fbPixelEnabledProp)) {
				const name = (fbPixelEnabledProp.select?.name ?? "")
					.toString()
					.toLowerCase();
				facebookPixelEnabled =
					name === "true" || name === "yes" || name === "enabled";
			} else if (
				fbPixelEnabledProp.type === "rich_text" ||
				fbPixelEnabledProp.type === "title"
			) {
				const txt = readRichText(fbPixelEnabledProp) ?? "";
				const name = txt.toLowerCase();
				facebookPixelEnabled =
					name === "true" || name === "yes" || name === "enabled";
			}
		}

		// Facebook Pixel Source - supports select or rich_text
		const facebookPixelSource = getUtmValue(props?.["Facebook Pixel Source"]);

		// Facebook Pixel Intent - supports select or rich_text
		const facebookPixelIntent = getUtmValue(props?.["Facebook Pixel Intent"]);

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
				// UTM parameters from Notion
				utm_source: getUtmValue(props?.["UTM Source"]),
				utm_medium: getUtmValue(props?.["UTM Medium"]),
				utm_campaign,
				utm_content: getUtmValue(props?.["UTM Content"]),
				utm_term: getUtmValue(props?.["UTM Term"]),
				utm_offer: getUtmValue(props?.["UTM Offer"]),
				// Facebook Pixel tracking fields
				facebookPixelEnabled,
				facebookPixelSource,
				facebookPixelIntent,
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

/**
 * Adds UTM parameters to a URL, using Notion UTM values if provided, otherwise defaults.
 * @param url - The destination URL
 * @param slug - The slug (used as default campaign if no Notion UTM campaign)
 * @param notionUtms - Optional UTM parameters from Notion
 * @returns URL with UTM parameters added
 */
export function withUtm(
	url: string,
	slug: string,
	notionUtms?: {
		utm_source?: string;
		utm_medium?: string;
		utm_campaign?: string;
		utm_content?: string;
		utm_term?: string;
		utm_offer?: string;
	},
): string {
	try {
		const u = new URL(url, "http://dummy.base");
		// Internal path: do not alter
		if (!/^https?:/i.test(url)) return url;

		// Determine site host in a deterministic way for SSR + CSR to avoid hydration mismatches.
		// Use a single source of truth that is embedded at build time on the client.
		// Set NEXT_PUBLIC_SITE_HOST="localhost:3000" in dev, and "www.leadorchestra.com" in prod.
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

		// If Notion UTMs are provided, remove all existing UTM parameters first
		// to ensure clean replacement and avoid conflicts
		if (notionUtms) {
			const utmKeysToDelete: string[] = [];
			for (const [key] of u.searchParams.entries()) {
				if (key.startsWith("utm_")) {
					utmKeysToDelete.push(key);
				}
			}
			for (const key of utmKeysToDelete) {
				u.searchParams.delete(key);
			}
		}

		// Use Notion UTM values if provided, otherwise use defaults
		if (notionUtms?.utm_source) {
			u.searchParams.set("utm_source", notionUtms.utm_source);
		} else if (!u.searchParams.get("utm_source")) {
			u.searchParams.set("utm_source", sourceHost);
		}

		if (notionUtms?.utm_campaign) {
			u.searchParams.set("utm_campaign", notionUtms.utm_campaign);
		} else if (!u.searchParams.get("utm_campaign")) {
			u.searchParams.set("utm_campaign", slug);
		}

		if (notionUtms?.utm_medium && !u.searchParams.get("utm_medium")) {
			u.searchParams.set("utm_medium", notionUtms.utm_medium);
		}

		if (notionUtms?.utm_content && !u.searchParams.get("utm_content")) {
			u.searchParams.set("utm_content", notionUtms.utm_content);
		}

		if (notionUtms?.utm_term && !u.searchParams.get("utm_term")) {
			u.searchParams.set("utm_term", notionUtms.utm_term);
		}

		if (notionUtms?.utm_offer && !u.searchParams.get("utm_offer")) {
			u.searchParams.set("utm_offer", notionUtms.utm_offer);
		}

		return u.toString();
	} catch {
		return url;
	}
}
