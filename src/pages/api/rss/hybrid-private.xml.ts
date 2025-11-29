import type { NextApiRequest, NextApiResponse } from "next";

import { XMLParser } from "fast-xml-parser";

const SITE_URL = "https://dealscale.io";
const BEEHIIV_FEED = "https://rss.beehiiv.com/feeds/th0QQipR7J.xml";
// Try multiple YouTube feed formats - YouTube may have changed their feed URLs
// Note: Channel ID should include the -A suffix: UCphkra97DMNIAIvA1y8hZ-A
const YOUTUBE_CHANNEL_ID =
	process.env.YOUTUBE_CHANNEL_ID || "UCphkra97DMNIAIvA1y8hZ-A";
const YOUTUBE_USERNAME = process.env.YOUTUBE_USERNAME || "DealScaleRealEstate";
const YOUTUBE_FEEDS = [
	`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
	`https://www.youtube.com/@${YOUTUBE_USERNAME}/videos.rss`,
	`https://www.youtube.com/feeds/videos.xml?user=${YOUTUBE_USERNAME}`,
];
const GITHUB_FEED =
	process.env.GITHUB_ATOM_FEED_URL ||
	"https://github.com/organizations/Deal-Scale/TechWithTy.private.atom?token=AI72D5O5LGXJVYOGAX5W7WGHFMVCY";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

type HybridEntry = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
	guid: string;
	source: "blog" | "youtube" | "github";
	categories?: string[];
};

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@_",
	trimValues: true,
	parseAttributeValue: true,
	parseTagValue: true,
	processEntities: true,
});

const sanitize = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const normalizeDate = (value?: string): string => {
	if (!value) {
		return new Date().toUTCString();
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime())
		? new Date().toUTCString()
		: parsed.toUTCString();
};

const ensureArray = <T>(value: T | T[] | undefined | null): T[] => {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
};

type BeehiivItem = {
	title?: unknown;
	link?: unknown;
	description?: unknown;
	"content:encoded"?: unknown;
	guid?: { _text?: string } | string;
	pubDate?: string;
	category?: unknown | unknown[];
};

type BeehiivParsed = {
	rss?: {
		channel?: {
			item?: BeehiivItem | BeehiivItem[];
		};
	};
};

const buildBeehiivEntries = (feedXml: string): HybridEntry[] => {
	const parsed = parser.parse(feedXml) as BeehiivParsed;

	const items = ensureArray(parsed.rss?.channel?.item);

	return items
		.map((item) => {
			const title = (item.title ?? "").toString().trim();
			const link = (item.link ?? "").toString().trim();
			const description =
				item.description ??
				item["content:encoded"] ??
				"Latest update from the DealScale blog.";
			const guidValue =
				typeof item.guid === "object" && item.guid?._text
					? String(item.guid._text)
					: typeof item.guid === "string"
						? item.guid
						: link || title;
			const guid = guidValue.toString();
			const categories = ensureArray(item.category)
				.map((category: unknown) =>
					typeof category === "string" || typeof category === "object"
						? String(category).trim()
						: "",
				)
				.filter((category: string): category is string => Boolean(category));

			return {
				title: title || "DealScale Blog Update",
				link: link || `${SITE_URL}/blog`,
				description: description.toString(),
				pubDate: normalizeDate(item.pubDate),
				guid,
				source: "blog" as const,
				categories,
			};
		})
		.filter((entry) => Boolean(entry.link));
};

type YouTubeEntry = {
	title?: { "#text"?: string } | string;
	link?: { "@_href"?: string } | string;
	published?: string;
	updated?: string;
	summary?: { "#text"?: string } | string;
	"yt:videoId"?: { "#text"?: string } | string;
	videoId?: { "#text"?: string } | string;
	"media:group"?: {
		"media:description"?: { "#text"?: string } | string;
		"media:keywords"?: { "#text"?: string } | string;
	};
	category?: unknown | unknown[];
};

type YouTubeParsed = {
	feed?: {
		entry?: YouTubeEntry | YouTubeEntry[];
	};
	rss?: {
		channel?: {
			item?:
				| {
						title?: string;
						link?: string;
						pubDate?: string;
						description?: string;
				  }
				| Array<{
						title?: string;
						link?: string;
						pubDate?: string;
						description?: string;
				  }>;
		};
	};
};

const buildYouTubeEntries = (feedXml: string): HybridEntry[] => {
	try {
		const parsed = parser.parse(feedXml) as YouTubeParsed;

		// Handle both Atom (feed.entry) and RSS (rss.channel.item) formats
		let entries: YouTubeEntry[] = [];
		if (parsed.feed?.entry) {
			entries = ensureArray(parsed.feed.entry);
		} else if (parsed.rss?.channel?.item) {
			// Convert RSS format to Atom-like structure for unified processing
			entries = ensureArray(parsed.rss.channel.item).map((item) => {
				const link = typeof item.link === "string" ? item.link : "";
				const videoIdMatch = link.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
				return {
					title: item.title,
					link: item.link,
					published: item.pubDate,
					updated: item.pubDate,
					summary: item.description,
					// Extract video ID from link
					videoId: videoIdMatch?.[1],
				} as YouTubeEntry;
			});
		}

		const mappedEntries: Array<HybridEntry | undefined> = entries.map(
			(entry) => {
				// Try multiple ways to extract videoId (handles different namespace formats)
				const videoId =
					entry["yt:videoId"]?.["#text"]?.toString?.().trim() ||
					entry["yt:videoId"]?.toString?.().trim() ||
					entry["yt:videoId"] ||
					entry.videoId?.["#text"]?.toString?.().trim() ||
					entry.videoId?.toString?.().trim() ||
					entry.videoId;

				if (!videoId) {
					// Try extracting from link if videoId not found
					const link = entry.link?.["@_href"] || entry.link;
					if (typeof link === "string") {
						const match = link.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
						if (match?.[1]) {
							const extractedId = match[1];
							const title =
								entry.title?.["#text"]?.toString?.().trim() ||
								entry.title?.toString?.().trim() ||
								entry.title ||
								"DealScale Video Update";
							const description =
								entry["media:group"]?.["media:description"]?.[
									"#text"
								]?.toString?.() ||
								entry["media:group"]?.["media:description"]?.toString?.() ||
								entry["media:group"]?.["media:description"] ||
								entry.summary?.["#text"]?.toString?.() ||
								entry.summary?.toString?.() ||
								entry.summary ||
								"Watch the latest automation insights from DealScale.";
							const published = entry.published || entry.updated;
							const keywords =
								entry["media:group"]?.["media:keywords"]?.[
									"#text"
								]?.toString?.() ||
								entry["media:group"]?.["media:keywords"]?.toString?.() ||
								entry["media:group"]?.["media:keywords"];

							return {
								title: title.toString(),
								link: `https://www.youtube.com/watch?v=${extractedId}`,
								description: description.toString(),
								pubDate: normalizeDate(published),
								guid: `youtube-${extractedId}`,
								source: "youtube" as const,
								categories: ensureArray(
									keywords ? keywords.split?.(",") : entry.category,
								)
									.map((keyword: unknown) => keyword?.toString?.().trim())
									.filter((keyword: string | undefined): keyword is string =>
										Boolean(keyword),
									),
							};
						}
					}
					return undefined;
				}

				const title =
					entry.title?.["#text"]?.toString?.().trim() ||
					entry.title?.toString?.().trim() ||
					entry.title ||
					"DealScale Video Update";
				const description =
					entry["media:group"]?.["media:description"]?.[
						"#text"
					]?.toString?.() ||
					entry["media:group"]?.["media:description"]?.toString?.() ||
					entry["media:group"]?.["media:description"] ||
					entry.summary?.["#text"]?.toString?.() ||
					entry.summary?.toString?.() ||
					entry.summary ||
					"Watch the latest automation insights from DealScale.";
				const published = entry.published || entry.updated;
				const keywords =
					entry["media:group"]?.["media:keywords"]?.["#text"]?.toString?.() ||
					entry["media:group"]?.["media:keywords"]?.toString?.() ||
					entry["media:group"]?.["media:keywords"];
				const categories = ensureArray(
					keywords ? keywords.split?.(",") : entry.category,
				)
					.map((keyword: unknown) => keyword?.toString?.().trim())
					.filter((keyword: string | undefined): keyword is string =>
						Boolean(keyword),
					);

				return {
					title: title.toString(),
					link: `https://www.youtube.com/watch?v=${videoId}`,
					description: description.toString(),
					pubDate: normalizeDate(published),
					guid: `youtube-${videoId}`,
					source: "youtube" as const,
					categories,
				};
			},
		);

		return mappedEntries.filter((entry): entry is HybridEntry =>
			Boolean(entry?.link),
		);
	} catch (error) {
		console.error("Error parsing YouTube feed:", error);
		return [];
	}
};

type GitHubEntry = {
	id?: string | { "#text"?: string };
	title?: string | { "#text"?: string };
	link?: { "@_href"?: string } | string;
	content?: { "#text"?: string } | string;
	published?: string;
	updated?: string;
	author?: { name?: string };
};

type GitHubParsed = {
	feed?: {
		entry?: GitHubEntry | GitHubEntry[];
	};
};

const buildGitHubEntries = (feedXml: string): HybridEntry[] => {
	const parsed = parser.parse(feedXml) as GitHubParsed;

	const entries = ensureArray(parsed.feed?.entry);

	const mappedEntries: Array<HybridEntry | undefined> = entries.map((entry) => {
		const id =
			typeof entry.id === "string"
				? entry.id.trim()
				: typeof entry.id === "object" && entry.id?.["#text"]
					? String(entry.id["#text"]).trim()
					: "";
		if (!id) return undefined;

		const title =
			typeof entry.title === "string"
				? entry.title.trim()
				: typeof entry.title === "object" && entry.title?.["#text"]
					? String(entry.title["#text"]).trim()
					: "GitHub Activity";
		const link =
			(typeof entry.link === "object" && entry.link?.["@_href"]
				? String(entry.link["@_href"])
				: typeof entry.link === "string"
					? entry.link
					: "") || "https://github.com/Deal-Scale";
		const content =
			(typeof entry.content === "object" && entry.content?.["#text"]
				? String(entry.content["#text"])
				: typeof entry.content === "string"
					? entry.content
					: "") || "";
		const description =
			typeof content === "string"
				? content.replace(/<[^>]+>/g, "").substring(0, 500) ||
					"Latest activity from Deal-Scale organization on GitHub."
				: "Latest activity from Deal-Scale organization on GitHub.";
		const published = entry.published || entry.updated;
		const author = entry.author?.name || "TechWithTy";

		// Extract event type from title (fork, push, etc.)
		const eventType = title.toLowerCase().includes("forked")
			? "fork"
			: title.toLowerCase().includes("pushed")
				? "push"
				: "activity";

		return {
			title: `${title} by ${author}`,
			link,
			description: description.toString(),
			pubDate: normalizeDate(published),
			guid: `github-${id}`,
			source: "github" as const,
			categories: [eventType, "github"],
		};
	});

	return mappedEntries.filter((entry): entry is HybridEntry =>
		Boolean(entry?.link),
	);
};

const buildChannelXml = (entries: HybridEntry[]): string => {
	const itemsXml = entries
		.map((entry) => {
			const categories = entry.categories
				?.map((category) => `<category>${sanitize(category)}</category>`)
				.join("");

			const sourceUrl =
				entry.source === "youtube"
					? "https://www.youtube.com/@DealScaleRealEstate"
					: entry.source === "github"
						? "https://github.com/Deal-Scale"
						: `${SITE_URL}/blog`;
			const sourceName =
				entry.source === "youtube"
					? "DealScale YouTube"
					: entry.source === "github"
						? "Deal-Scale GitHub"
						: "DealScale Blog";

			return `<item>
	<title>${sanitize(entry.title)}</title>
	<link>${sanitize(entry.link)}</link>
	<guid isPermaLink="${entry.source === "blog"}">${sanitize(entry.guid)}</guid>
	<pubDate>${entry.pubDate}</pubDate>
	<description><![CDATA[${entry.description}]]></description>
	${categories ?? ""}
	<source url="${sanitize(sourceUrl)}">${sanitize(sourceName)}</source>
</item>`;
		})
		.join("\n\n");

	const lastBuildDate = entries[0]?.pubDate ?? new Date().toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>DealScale Private Hybrid Feed</title>
	<link>${SITE_URL}</link>
	<description>Private unified feed combining DealScale blog posts, YouTube videos, and GitHub activity.</description>
	<language>en-us</language>
	<lastBuildDate>${lastBuildDate}</lastBuildDate>
${itemsXml}
</channel>
</rss>`;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Try YouTube feeds in order until one works
	const fetchYouTubeFeed = async (): Promise<{
		ok: boolean;
		text: () => Promise<string>;
		status: number;
		statusText: string;
	}> => {
		for (const feedUrl of YOUTUBE_FEEDS) {
			try {
				const response = await fetch(feedUrl, {
					headers: {
						"User-Agent": "DealScaleHybridRSSProxy/1.0 (+https://dealscale.io)",
						Accept:
							"application/atom+xml, application/rss+xml, application/xml;q=0.9, */*;q=0.8",
					},
				});
				if (response.ok) {
					console.log(`YouTube feed successful: ${feedUrl}`);
					return response;
				}
				console.warn(`YouTube feed failed (${response.status}): ${feedUrl}`);
			} catch (error) {
				console.warn(`YouTube feed error for ${feedUrl}:`, error);
			}
		}
		// Return a failed response if all feeds fail
		return {
			ok: false,
			status: 404,
			statusText: "Not Found",
			text: async () => "",
		};
	};

	try {
		const [beehiivResult, youtubeResult, githubResult] =
			await Promise.allSettled([
				fetch(BEEHIIV_FEED, {
					headers: {
						"User-Agent": "DealScaleHybridRSSProxy/1.0 (+https://dealscale.io)",
						Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
					},
				}),
				fetchYouTubeFeed(),
				fetch(GITHUB_FEED, {
					headers: {
						"User-Agent": "DealScaleHybridRSSProxy/1.0 (+https://dealscale.io)",
						Accept: "application/atom+xml, application/xml;q=0.9, */*;q=0.8",
					},
				}),
			]);

		const beehiivXml =
			beehiivResult.status === "fulfilled" && beehiivResult.value.ok
				? await beehiivResult.value.text()
				: "";
		const youtubeXml =
			youtubeResult.status === "fulfilled" && youtubeResult.value.ok
				? await youtubeResult.value.text()
				: "";
		const githubXml =
			githubResult.status === "fulfilled" && githubResult.value.ok
				? await githubResult.value.text()
				: "";

		// Log feed fetch status for debugging
		if (youtubeResult.status === "rejected") {
			console.error("YouTube feed fetch failed:", youtubeResult.reason);
		} else if (!youtubeResult.value.ok) {
			console.error(
				"YouTube feed returned error:",
				youtubeResult.value.status,
				youtubeResult.value.statusText,
			);
		} else if (youtubeXml) {
			console.log(
				"YouTube feed fetched successfully, length:",
				youtubeXml.length,
			);
		}

		const beehiivEntries = beehiivXml ? buildBeehiivEntries(beehiivXml) : [];
		const youtubeEntries = youtubeXml ? buildYouTubeEntries(youtubeXml) : [];
		const githubEntries = githubXml ? buildGitHubEntries(githubXml) : [];

		console.log(
			`Feed entries: Beehiiv=${beehiivEntries.length}, YouTube=${youtubeEntries.length}, GitHub=${githubEntries.length}`,
		);

		const combinedEntries = [
			...beehiivEntries,
			...youtubeEntries,
			...githubEntries,
		].sort(
			(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
		);

		// If no entries, return a valid RSS feed with a message item
		if (combinedEntries.length === 0) {
			const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>DealScale Private Hybrid Feed</title>
	<link>${SITE_URL}</link>
	<description>Private unified feed combining DealScale blog posts, YouTube videos, and GitHub activity.</description>
	<language>en-us</language>
	<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
	<item>
		<title>No Content Available</title>
		<link>${SITE_URL}</link>
		<description>Feed sources are currently unavailable. Please check back later.</description>
		<pubDate>${new Date().toUTCString()}</pubDate>
		<guid isPermaLink="false">empty-feed-${Date.now()}</guid>
	</item>
</channel>
</rss>`;
			res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
			res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			res.status(200).send(emptyFeed);
			return;
		}

		const feedXml = buildChannelXml(combinedEntries);

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(feedXml);
	} catch (error) {
		console.error("Error building private hybrid RSS feed:", error);
		const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>DealScale Private Hybrid Feed Error</title>
	<link>${SITE_URL}</link>
	<description>Private hybrid feed temporarily unavailable. Please try again later.</description>
	<language>en-us</language>
	<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
	<item>
		<title>Feed Temporarily Unavailable</title>
		<link>${SITE_URL}</link>
		<description>We're experiencing issues fetching feed content. Please try again later.</description>
		<pubDate>${new Date().toUTCString()}</pubDate>
		<guid isPermaLink="false">error-${Date.now()}</guid>
	</item>
</channel>
</rss>`;
		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		res.status(502).send(errorFeed);
	}
}
