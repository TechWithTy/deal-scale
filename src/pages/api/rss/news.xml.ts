import type { NextApiRequest, NextApiResponse } from "next";

import { XMLParser } from "fast-xml-parser";

const SITE_URL = "https://dealscale.io";
const INMAN_FEED = "https://feeds.feedburner.com/inmannews";
const REIT_FEED = process.env.REIT_RSS_FEED_URL || "https://www.reit.com/feed";
const CONNECT_CRE_FEED =
	process.env.CONNECT_CRE_RSS_FEED_URL || "https://www.connectcre.com/feed";
const WORLD_PROPERTY_JOURNAL_FEED =
	"https://www.worldpropertyjournal.com/real-estate-news-rss-feed.php";
const FIRST_TUESDAY_FEED =
	process.env.FIRST_TUESDAY_RSS_FEED_URL ||
	"https://journal.firsttuesday.us/feed";
const NAR_FEED = process.env.NAR_RSS_FEED_URL || "https://www.nar.realtor/feed";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

type NewsEntry = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
	guid: string;
	source: string;
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

type RSSItem = {
	title?: unknown;
	link?: unknown;
	description?: unknown;
	"content:encoded"?: unknown;
	guid?: { _text?: string } | string;
	pubDate?: string;
	published?: string;
	updated?: string;
	category?: unknown | unknown[];
};

type RSSParsed = {
	rss?: {
		channel?: {
			item?: RSSItem | RSSItem[];
		};
	};
	feed?: {
		entry?: RSSItem | RSSItem[];
	};
};

const buildRSSEntries = (feedXml: string, sourceName: string): NewsEntry[] => {
	try {
		const parsed = parser.parse(feedXml) as RSSParsed;

		// Handle both RSS 2.0 (rss.channel.item) and Atom (feed.entry) formats
		let items: RSSItem[] = [];
		if (parsed.rss?.channel?.item) {
			items = ensureArray(parsed.rss.channel.item);
		} else if (parsed.feed?.entry) {
			items = ensureArray(parsed.feed.entry);
		}

		return items
			.map((item) => {
				const title = (item.title ?? "").toString().trim();
				const link =
					typeof item.link === "object" && item.link?.["@_href"]
						? String(item.link["@_href"])
						: (item.link ?? "").toString().trim();
				const description =
					item.description ??
					item["content:encoded"] ??
					`Latest update from ${sourceName}.`;
				const guidValue =
					typeof item.guid === "object" && item.guid?._text
						? String(item.guid._text)
						: typeof item.guid === "string"
							? item.guid
							: link || title;
				const guid = guidValue.toString();
				const pubDate =
					item.pubDate || item.published || item.updated || new Date();
				const categories = ensureArray(item.category)
					.map((category: unknown) =>
						typeof category === "string" || typeof category === "object"
							? String(category).trim()
							: "",
					)
					.filter((category: string): category is string => Boolean(category));

				return {
					title: title || `${sourceName} Update`,
					link: link || SITE_URL,
					description: description.toString(),
					pubDate: normalizeDate(pubDate.toString()),
					guid,
					source: sourceName,
					categories,
				};
			})
			.filter((entry) => Boolean(entry.link && entry.title));
	} catch (error) {
		console.error(`Error parsing ${sourceName} feed:`, error);
		return [];
	}
};

const buildChannelXml = (entries: NewsEntry[]): string => {
	const itemsXml = entries
		.map((entry) => {
			const categories = entry.categories
				?.map((category) => `<category>${sanitize(category)}</category>`)
				.join("");

			return `<item>
	<title>${sanitize(entry.title)}</title>
	<link>${sanitize(entry.link)}</link>
	<guid isPermaLink="true">${sanitize(entry.guid)}</guid>
	<pubDate>${entry.pubDate}</pubDate>
	<description><![CDATA[${entry.description}]]></description>
	${categories ?? ""}
	<source url="${sanitize(entry.link)}">${sanitize(entry.source)}</source>
</item>`;
		})
		.join("\n\n");

	const lastBuildDate = entries[0]?.pubDate ?? new Date().toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>DealScale Real Estate News Aggregator</title>
	<link>${SITE_URL}</link>
	<description>Unified feed combining news from Inman News, REIT.com, Connect CRE, World Property Journal, first tuesday, and NAR.</description>
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
	try {
		const [
			inmanResult,
			reitResult,
			connectCreResult,
			wpjResult,
			ftResult,
			narResult,
		] = await Promise.allSettled([
			fetch(INMAN_FEED, {
				headers: {
					"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
			fetch(REIT_FEED, {
				headers: {
					"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
			fetch(CONNECT_CRE_FEED, {
				headers: {
					"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
			fetch(WORLD_PROPERTY_JOURNAL_FEED, {
				headers: {
					"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
			fetch(FIRST_TUESDAY_FEED, {
				headers: {
					"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
			fetch(NAR_FEED, {
				headers: {
					"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
		]);

		const inmanXml =
			inmanResult.status === "fulfilled" && inmanResult.value.ok
				? await inmanResult.value.text()
				: "";
		const reitXml =
			reitResult.status === "fulfilled" && reitResult.value.ok
				? await reitResult.value.text()
				: "";
		const connectCreXml =
			connectCreResult.status === "fulfilled" && connectCreResult.value.ok
				? await connectCreResult.value.text()
				: "";
		const wpjXml =
			wpjResult.status === "fulfilled" && wpjResult.value.ok
				? await wpjResult.value.text()
				: "";
		const ftXml =
			ftResult.status === "fulfilled" && ftResult.value.ok
				? await ftResult.value.text()
				: "";
		const narXml =
			narResult.status === "fulfilled" && narResult.value.ok
				? await narResult.value.text()
				: "";

		const inmanEntries = inmanXml
			? buildRSSEntries(inmanXml, "Inman News")
			: [];
		const reitEntries = reitXml ? buildRSSEntries(reitXml, "REIT.com") : [];
		const connectCreEntries = connectCreXml
			? buildRSSEntries(connectCreXml, "Connect CRE")
			: [];
		const wpjEntries = wpjXml
			? buildRSSEntries(wpjXml, "World Property Journal")
			: [];
		const ftEntries = ftXml ? buildRSSEntries(ftXml, "first tuesday") : [];
		const narEntries = narXml ? buildRSSEntries(narXml, "NAR") : [];

		console.log(
			`News feed entries: Inman=${inmanEntries.length}, REIT=${reitEntries.length}, Connect CRE=${connectCreEntries.length}, WPJ=${wpjEntries.length}, first tuesday=${ftEntries.length}, NAR=${narEntries.length}`,
		);

		const combinedEntries = [
			...inmanEntries,
			...reitEntries,
			...connectCreEntries,
			...wpjEntries,
			...ftEntries,
			...narEntries,
		].sort(
			(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
		);

		// If no entries, return a valid RSS feed with a message item
		if (combinedEntries.length === 0) {
			const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>DealScale Real Estate News Aggregator</title>
	<link>${SITE_URL}</link>
	<description>Unified feed combining news from Inman News, REIT.com, Connect CRE, World Property Journal, first tuesday, and NAR.</description>
	<language>en-us</language>
	<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
	<item>
		<title>No Content Available</title>
		<link>${SITE_URL}</link>
		<description>News feed sources are currently unavailable. Please check back later.</description>
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
		console.error("Error building news RSS feed:", error);
		const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>DealScale Real Estate News Aggregator Error</title>
	<link>${SITE_URL}</link>
	<description>News feed temporarily unavailable. Please try again later.</description>
	<language>en-us</language>
	<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
	<item>
		<title>Feed Temporarily Unavailable</title>
		<link>${SITE_URL}</link>
		<description>We're experiencing issues fetching news feed content. Please try again later.</description>
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
