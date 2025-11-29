import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Update with actual Connect CRE RSS feed URL
// The provided URL is a page listing feeds, not the actual feed
// Common pattern: https://www.connectcre.com/feed or https://www.connectcre.com/rss
const CONNECT_CRE_FEED =
	process.env.CONNECT_CRE_RSS_FEED_URL || "https://www.connectcre.com/feed";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(CONNECT_CRE_FEED, {
			headers: {
				"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
				Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`Connect CRE returned status ${response.status}`);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);
	} catch (error) {
		console.error("Error fetching Connect CRE RSS feed:", error);
		res
			.status(502)
			.send(
				'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Connect CRE Feed Error</title><description>Connect CRE RSS temporarily unavailable.</description></channel></rss>',
			);
	}
}
