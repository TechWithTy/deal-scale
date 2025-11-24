import type { NextApiRequest, NextApiResponse } from "next";

const INMAN_FEED = "https://feeds.feedburner.com/inmannews";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(INMAN_FEED, {
			headers: {
				"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
				Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`Inman News returned status ${response.status}`);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);
	} catch (error) {
		console.error("Error fetching Inman News RSS feed:", error);
		res.status(502).send(
			'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Inman News Feed Error</title><description>Inman News RSS temporarily unavailable.</description></channel></rss>',
		);
	}
}

