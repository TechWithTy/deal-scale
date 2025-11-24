import { DEFAULT_SEO } from "@/data/constants/seo";
import type { LegalDocument } from "@/data/legal/legalDocuments";
import { legalDocuments } from "@/data/legal/legalDocuments";
import type { SeoMeta } from "./seo";

function resolveSiteOrigin(): string {
	const fallback = DEFAULT_SEO.canonical ?? "https://leadorchestra.com";
	const candidates = [
		process.env.NEXT_PUBLIC_SITE_URL,
		fallback,
		"https://leadorchestra.com",
	];

	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			const parsed = new URL(candidate);
			if (parsed.protocol === "https:") {
				return parsed.origin;
			}
		} catch {
			continue;
		}
	}

	// If no HTTPS origin found, fall back gracefully using the first valid URL
	for (const candidate of candidates) {
		if (!candidate) continue;
		try {
			return new URL(candidate).origin;
		} catch {
			continue;
		}
	}

	return "https://leadorchestra.com";
}

const SITE_ORIGIN = resolveSiteOrigin();

function normalizePath(path: string | undefined, slug: string): string {
	if (!path || typeof path !== "string" || path.trim().length === 0) {
		return `/legal/${slug}`;
	}
	return path.startsWith("/") ? path : `/${path}`;
}

export function resolveLegalDocumentPath(doc: LegalDocument): string {
	return normalizePath(doc.path, doc.slug);
}

export function resolveLegalDocumentCanonical(doc: LegalDocument): string {
	const explicitUrl = doc.liveTemplateUrl;
	if (explicitUrl && explicitUrl.trim().length > 0) {
		if (/^https?:\/\//i.test(explicitUrl)) {
			return explicitUrl;
		}
		return `${SITE_ORIGIN}${explicitUrl.startsWith("/") ? "" : "/"}${explicitUrl}`;
	}

	const path = resolveLegalDocumentPath(doc);
	return `${SITE_ORIGIN}${path}`;
}

function toIso8601(dateLike: string | undefined): string | undefined {
	if (!dateLike) {
		return undefined;
	}

	const parsed = new Date(dateLike);
	if (Number.isNaN(parsed.getTime())) {
		return undefined;
	}

	return parsed.toISOString();
}

export function buildLegalSeoMeta(doc: LegalDocument): SeoMeta {
	const canonical = resolveLegalDocumentCanonical(doc);
	const lastUpdatedIso = toIso8601(doc.lastUpdated);

	const keywords = Array.from(
		new Set([doc.title, "Deal Scale Legal Document", ...DEFAULT_SEO.keywords]),
	);

	return {
		title: `${doc.title} | Deal Scale`,
		description: doc.description,
		canonical,
		keywords,
		image: DEFAULT_SEO.image,
		type: "article",
		dateModified: lastUpdatedIso,
		priority: 0.3,
		changeFrequency: "yearly",
	};
}

export function buildLegalJsonLd(doc: LegalDocument): Record<string, unknown> {
	const canonical = resolveLegalDocumentCanonical(doc);
	const lastUpdatedIso = toIso8601(doc.lastUpdated);

	const policyType: Record<string, string> = {
		"privacy-policy": "PrivacyPolicy",
		"terms-of-service": "Legislation",
		"cookie-policy": "WebPage",
		"tcpa-compliance": "Legislation",
		"gdpr-policy": "Legislation",
		"hipaa-policy": "Legislation",
		"pii-handling-policy": "Legislation",
	};

	const schemaType =
		policyType[doc.slug as keyof typeof policyType] ?? "WebPage";

	return {
		"@context": "https://schema.org",
		"@type": schemaType,
		name: doc.title,
		description: doc.description,
		url: canonical,
		dateModified: lastUpdatedIso,
		isPartOf: {
			"@type": "WebSite",
			name: DEFAULT_SEO.siteName,
			url: DEFAULT_SEO.canonical,
		},
		publisher: {
			"@type": "Organization",
			name: "Deal Scale",
			url: DEFAULT_SEO.canonical,
			logo: {
				"@type": "ImageObject",
				url: resolveLogoUrl(DEFAULT_SEO.image),
			},
		},
	};
}

function resolveLogoUrl(imagePath: string | undefined): string | undefined {
	if (!imagePath) return undefined;
	if (imagePath.startsWith("http")) return imagePath;
	return `${SITE_ORIGIN}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

const legalDocumentsByPath = new Map<string, LegalDocument>();
const legalDocumentsBySlug = new Map<string, LegalDocument>();

for (const doc of legalDocuments) {
	const path = resolveLegalDocumentPath(doc);
	legalDocumentsByPath.set(path, doc);
	legalDocumentsBySlug.set(doc.slug, doc);
}

export function getLegalDocumentByPath(
	path: string,
): LegalDocument | undefined {
	const normalized = normalizePath(path, path.replace(/^\//, ""));
	return legalDocumentsByPath.get(normalized);
}

export function getLegalDocumentBySlug(
	slug: string,
): LegalDocument | undefined {
	return legalDocumentsBySlug.get(slug);
}

export function buildLegalSeoMetaMap(): Record<string, SeoMeta> {
	const entries: Record<string, SeoMeta> = {};

	for (const doc of legalDocuments) {
		const path = resolveLegalDocumentPath(doc);
		entries[path] = buildLegalSeoMeta(doc);
	}

	return entries;
}

export function buildLegalJsonLdFromPath(
	path: string,
): Record<string, unknown> | undefined {
	const doc = getLegalDocumentByPath(path);
	return doc ? buildLegalJsonLd(doc) : undefined;
}
