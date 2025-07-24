import { type NextRequest, NextResponse } from "next/server";
import { getTweet } from "react-tweet/api";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	console.log("[API/twitter] Request received.");
	console.log("[API/twitter] Tweet ID:", id);

	if (!id) {
		console.log("[API/twitter] No tweet ID provided.");
		return NextResponse.json({ error: "Missing tweet id" }, { status: 400 });
	}

	try {
		console.log(`[API/twitter] Fetching tweet for ID: ${id}`);
		const tweet = await getTweet(id);
		console.log(`[API/twitter] Tweet fetched successfully for ID: ${id}`);
		return NextResponse.json(tweet);
	} catch (e: unknown) {
		console.error(`[API/twitter] Error fetching tweet for ID: ${id}`, e);
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
}
