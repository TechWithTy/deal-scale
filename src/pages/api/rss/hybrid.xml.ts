import type { NextApiRequest, NextApiResponse } from "next";

import { XMLParser } from "fast-xml-parser";

const SITE_URL = "https://dealscale.io";
const BEEHIIV_FEED = "https://rss.beehiiv.com/feeds/th0QQipR7J.xml";
const YOUTUBE_FEED =
	"https://www.youtube.com/feeds/videos.xml?channel_id=UCphkra97DMNIAIvA1y8hZ";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

type HybridEntry = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
	guid: string;
	source: "blog" | "youtube";
	categories?: string[];
};

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@_",
	trimValues: true,
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

const buildBeehiivEntries = (feedXml: string): HybridEntry[] => {
	const parsed = parser.parse(feedXml) as {
		rss?: { channel?: { item?: any[] | any } };
	};

	const items = ensureArray(parsed.rss?.channel?.item);

	return items
		.map((item) => {
			const title = (item.title ?? "").toString().trim();
			const link = (item.link ?? "").toString().trim();
			const description =
				item.description ??
				item["content:encoded"] ??
				"Latest update from the DealScale blog.";
			const guid = (item.guid?._text ?? item.guid ?? link ?? title).toString();
			const categories = ensureArray(item.category)
				.map((category: unknown) => category?.toString?.().trim())
				.filter((category: string | undefined): category is string =>
					Boolean(category),
				);

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

const buildYouTubeEntries = (feedXml: string): HybridEntry[] => {
	const parsed = parser.parse(feedXml) as {
		feed?: { entry?: any[] | any };
	};

	const entries = ensureArray(parsed.feed?.entry);

	const mappedEntries: Array<HybridEntry | undefined> = entries.map((entry) => {
		const videoId = entry["yt:videoId"]?.toString?.().trim();
		if (!videoId) return undefined;

		const title = entry.title?.toString?.().trim() ?? "DealScale Video Update";
		const description =
			entry["media:group"]?.["media:description"] ??
			"Watch the latest automation insights from DealScale.";
		const published = entry.published ?? entry.updated;
		const keywords = entry["media:group"]?.["media:keywords"];
		const categories = ensureArray(
			keywords ? keywords.split?.(",") : entry.category,
		)
			.map((keyword: unknown) => keyword?.toString?.().trim())
			.filter((keyword: string | undefined): keyword is string =>
				Boolean(keyword),
			);

		return {
			title,
			link: `https://www.youtube.com/watch?v=${videoId}`,
			description: description.toString(),
			pubDate: normalizeDate(published),
			guid: `youtube-${videoId}`,
			source: "youtube" as const,
			categories,
		};
	});

	return mappedEntries.filter((entry): entry is HybridEntry =>
		Boolean(entry && entry.link),
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
					: `${SITE_URL}/blog`;
			const sourceName =
				entry.source === "youtube" ? "DealScale YouTube" : "DealScale Blog";

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
	<title>DealScale Hybrid Feed</title>
	<link>${SITE_URL}</link>
	<description>Unified feed combining DealScale blog posts and YouTube videos.</description>
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
		const [beehiivResult, youtubeResult] = await Promise.allSettled([
			fetch(BEEHIIV_FEED, {
				headers: {
					"User-Agent": "DealScaleHybridRSSProxy/1.0 (+https://dealscale.io)",
					Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
				},
			}),
			fetch(YOUTUBE_FEED, {
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

		const combinedEntries = [
			...(beehiivXml ? buildBeehiivEntries(beehiivXml) : []),
			...(youtubeXml ? buildYouTubeEntries(youtubeXml) : []),
		].sort(
			(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
		);

		if (combinedEntries.length === 0) {
			throw new Error("No entries available from Beehiiv or YouTube feeds.");
		}

		const feedXml = buildChannelXml(combinedEntries);

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(feedXml);
	} catch (error) {
		console.error("Error building hybrid RSS feed:", error);
		res
			.status(502)
			.send(
				'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>DealScale Hybrid Feed Error</title><description>Hybrid feed temporarily unavailable.</description></channel></rss>',
			);
	}
}
