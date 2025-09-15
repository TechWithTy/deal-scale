import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function middleware(req: NextRequest) {
	// Extract the first path segment as slug and normalize to lowercase
	const slug = req.nextUrl.pathname.split("/")[1]?.toLowerCase();
	if (!slug) return NextResponse.next();

	console.log(`Checking slug: ${slug}`);

	try {
		const campaign = await redis.hgetall<{
			destination: string;
			utm: Record<string, string>;
		}>(`campaign:${slug}`);

		if (campaign?.destination) {
			console.log(`Redirecting ${slug} to ${campaign.destination}`);
			const url = req.nextUrl.clone();
			url.pathname = campaign.destination;

			// Append UTM params
			if (campaign.utm) {
				for (const [key, value] of Object.entries(campaign.utm)) {
					url.searchParams.set(key, value);
				}
			}

			return NextResponse.redirect(url);
		} else {
			console.log(`No campaign found for slug: ${slug}`);
		}
	} catch (error) {
		console.error("Redis error:", error);
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/:slug*",
};
