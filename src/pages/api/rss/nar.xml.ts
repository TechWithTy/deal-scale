import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Update with actual NAR RSS feed URL
// The provided URL is a page listing feeds, not the actual feed
// Common pattern: https://www.nar.realtor/feed or https://www.nar.realtor/rss
// NAR may have multiple feeds (news, magazine, etc.) - choose the most relevant
const NAR_FEED =
	process.env.NAR_RSS_FEED_URL || "https://www.nar.realtor/feed";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(NAR_FEED, {
			headers: {
				"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://leadorchestra.com)",
				Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`NAR returned status ${response.status}`);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);
	} catch (error) {
		console.error("Error fetching NAR RSS feed:", error);
		res.status(502).send(
			'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>NAR Feed Error</title><description>NAR RSS temporarily unavailable.</description></channel></rss>',
		);
	}
}

