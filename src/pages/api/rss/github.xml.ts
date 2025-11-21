import type { NextApiRequest, NextApiResponse } from "next";

const GITHUB_FEED =
	process.env.GITHUB_ATOM_FEED_URL ||
	"https://github.com/organizations/Deal-Scale/TechWithTy.private.atom?token=AI72D5O5LGXJVYOGAX5W7WGHFMVCY";
const CACHE_CONTROL = "s-maxage=900, stale-while-revalidate=3600";

export default async function handler(
	_req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const response = await fetch(GITHUB_FEED, {
			headers: {
				"User-Agent": "DealScaleGitHubRSSProxy/1.0 (+https://dealscale.io)",
				Accept: "application/atom+xml, application/xml;q=0.9, */*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub returned status ${response.status}`);
		}

		const xml = await response.text();

		res.setHeader("Content-Type", "application/atom+xml; charset=utf-8");
		res.setHeader("Cache-Control", CACHE_CONTROL);
		res.status(200).send(xml);
	} catch (error) {
		console.error("Error fetching GitHub RSS feed:", error);
		res
			.status(502)
			.send(
				'<?xml version="1.0" encoding="UTF-8"?><feed><title>DealScale GitHub Feed Error</title><subtitle>GitHub RSS temporarily unavailable.</subtitle></feed>',
			);
	}
}

