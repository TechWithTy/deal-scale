import type { NextApiRequest, NextApiResponse } from "next";

const WORLD_PROPERTY_JOURNAL_FEED =
	"https://www.worldpropertyjournal.com/real-estate-news-rss-feed.php";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(WORLD_PROPERTY_JOURNAL_FEED, {
			headers: {
				"User-Agent": "DealScaleNewsRSSProxy/1.0 (+https://dealscale.io)",
				Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(
				`World Property Journal returned status ${response.status}`,
			);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);
	} catch (error) {
		console.error("Error fetching World Property Journal RSS feed:", error);
		res
			.status(502)
			.send(
				'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>World Property Journal Feed Error</title><description>World Property Journal RSS temporarily unavailable.</description></channel></rss>',
			);
	}
}
