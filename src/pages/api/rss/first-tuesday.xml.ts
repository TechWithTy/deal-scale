import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Update with actual first tuesday RSS feed URL
// The provided URL is a page listing feeds, not the actual feed
// Common pattern: https://journal.firsttuesday.us/feed or https://journal.firsttuesday.us/rss
const FIRST_TUESDAY_FEED =
	process.env.FIRST_TUESDAY_RSS_FEED_URL ||
	"https://journal.firsttuesday.us/feed";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(FIRST_TUESDAY_FEED, {
			headers: {
				"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://leadorchestra.com)",
				Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`first tuesday returned status ${response.status}`);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);
	} catch (error) {
		console.error("Error fetching first tuesday RSS feed:", error);
		res.status(502).send(
			'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>first tuesday Feed Error</title><description>first tuesday RSS temporarily unavailable.</description></channel></rss>',
		);
	}
}

