import type { NextApiRequest, NextApiResponse } from "next";

const BEEHIIV_FEED = "https://rss.beehiiv.com/feeds/th0QQipR7J.xml";
const CACHE_CONTROL = "s-maxage=3600, stale-while-revalidate=86400";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(BEEHIIV_FEED, {
			headers: {
				"User-Agent": "DealScaleRSSProxy/1.0 (+https://dealscale.io)",
				Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`Beehiiv returned ${response.status}`);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);

		void notifyIndexNow().catch((error) => {
			console.warn("[rss] IndexNow notification failed:", error);
		});
	} catch (error) {
		console.error("Error fetching RSS:", error);
		res
			.status(502)
			.send(
				'<?xml version="1.0" encoding="UTF-8"?><rss><channel><title>DealScale Feed Error</title><description>RSS temporarily unavailable.</description></channel></rss>',
			);
	}
}

async function notifyIndexNow(): Promise<void> {
	const key =
		process.env.PRIVATE_INDEX_NOW_KEY?.trim() ??
		process.env.INDEXNOW_KEY?.trim();

	if (!key) {
		console.warn("[rss] IndexNow key missing; skipping notification.");
		return;
	}

	const payload = {
		host: "dealscale.io",
		key,
		keyLocation: "https://dealscale.io/06663aa83dc949d6bde61889ae81d42f.txt",
		urlList: ["https://dealscale.io/rss.xml"],
	};

	const response = await fetch("https://api.indexnow.org/indexnow", {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const body = await response.text().catch(() => "<unavailable>");
		throw new Error(
			`IndexNow responded with ${response.status} ${response.statusText}: ${body.slice(
				0,
				200,
			)}`,
		);
	}
}
