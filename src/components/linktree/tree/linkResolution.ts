import { withUtm } from "@/utils/linktree-redis";
import type { LinkTreeItem } from "@/utils/linktree-redis";

function sanitizeUrlLike(input: string | undefined | null): string {
	let s = String(input ?? "");
	// Remove common invisible spaces without unicode-range classes (to satisfy strict linters)
	s = s.replace(/\uFEFF/g, "").replace(/\u00A0/g, " ");
	s = s.trim();
	return s;
}

function isValidAbsoluteHttpUrl(s: string): boolean {
	try {
		const u = new URL(s);
		return (
			(u.protocol === "http:" || u.protocol === "https:") && Boolean(u.hostname)
		);
	} catch {
		return false;
	}
}

export function resolveLink(item: LinkTreeItem): {
	dest: string;
	isExternal: boolean;
} {
	const raw0 = withUtm(item.destination, item.slug);
	let dest = sanitizeUrlLike(raw0);
	const isAbsolute = /^(https?:)\/\//i.test(dest);
	const isProtoRelative = /^\/\//.test(dest);
	const isRelativePath = dest.startsWith("/");
	let isExternal = false;

	// Determine externality for UI hints
	if (isAbsolute || isProtoRelative || (!isRelativePath && dest.length > 0)) {
		isExternal = true;
	}

	// Always route through internal slug so middleware can increment Redirects (Calls)
	const slugPath = item.slug ? `/${String(item.slug).replace(/^\//, "")}` : "#";
	// If destination is an internal path already, keep it; otherwise force slug path
	if (!isRelativePath) {
		dest = slugPath;
	}

	// Inspect internal redirect wrapper and unwrap display href
	try {
		if (/^\/api\/redirect\b/.test(dest)) {
			const base =
				typeof window !== "undefined"
					? window.location.origin
					: "http://localhost";
			const u = new URL(dest, base);
			const to = u.searchParams.get("to") ?? "";
			const decoded = to.startsWith("%2F") ? decodeURIComponent(to) : to;
			const looksExternal =
				/^(https?:)\/\//i.test(decoded) ||
				/^\/\//.test(decoded) ||
				(!decoded.startsWith("/") && decoded.length > 0);
			if (looksExternal) {
				isExternal = true;
			}
			// For display, if decoded looks like a usable target, unwrap it so <a href> is clean
			if (decoded && decoded.length > 0) {
				if (decoded.startsWith("/")) {
					dest = decoded;
				} else if (/^\/\//.test(decoded)) {
					dest = `https:${decoded}`;
				} else if (/^(https?:)\/\//i.test(decoded)) {
					dest = decoded;
				} else if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(decoded)) {
					dest = `https://${decoded}`;
					isExternal = true;
				}
			}
		}
	} catch {}

	// Notion override
	if (item.redirectExternal) isExternal = true;

	// Final safety: if somehow absolute sneaks in and is malformed, fall back to slug
	if (/^https?:\/\//i.test(dest) && !isValidAbsoluteHttpUrl(dest)) {
		if (typeof window !== "undefined") {
			// eslint-disable-next-line no-console
			console.warn(
				"[LinkTree] Invalid absolute URL for slug:",
				item.slug,
				JSON.stringify(dest),
			);
		}
		const fallback = item.slug
			? `/${String(item.slug).replace(/^\//, "")}`
			: "#";
		return { dest: fallback, isExternal: false };
	}

	return { dest, isExternal };
}
