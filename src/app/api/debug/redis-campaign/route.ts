import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const slug = req.nextUrl.searchParams.get("slug");
	if (!slug) {
		return NextResponse.json(
			{ ok: false, error: "missing slug" },
			{ status: 400 },
		);
	}

	const redis = Redis.fromEnv();
	const key = `campaign:${slug}`;
	const data = await redis.hgetall(key);

	return NextResponse.json({ ok: true, key, data });
}
