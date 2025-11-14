import { NextResponse } from "next/server";

// Simple video proxy to avoid CORS/MIME issues from third-party hosts
// Supports Range requests for video scrubbing.
export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const target = url.searchParams.get("url");
		if (!target) {
			return NextResponse.json(
				{ ok: false, error: "missing url" },
				{ status: 400 },
			);
		}
		// Basic safety: only allow http/https targets
		if (!/^https?:\/\//i.test(target)) {
			return NextResponse.json(
				{ ok: false, error: "invalid url" },
				{ status: 400 },
			);
		}

		const range = req.headers.get("range") ?? undefined;

		const upstream = await fetch(target, {
			// Forward Range to support partial content
			headers: range ? { Range: range } : undefined,
			cache: "no-store",
		});

		// If upstream fails, bubble status
		if (!upstream.ok && upstream.status !== 206) {
			const text = await upstream.text().catch(() => "");
			return new NextResponse(text, { status: upstream.status });
		}

		// Copy relevant headers
		const headers = new Headers();
		// Preserve common media headers
		const passThrough = [
			"content-type",
			"content-length",
			"accept-ranges",
			"content-range",
			"cache-control",
			"etag",
			"last-modified",
		];
		for (const h of passThrough) {
			const v = upstream.headers.get(h);
			if (v) headers.set(h, v);
		}
		// Ensure the response is not cached aggressively by intermediaries
		if (!headers.has("cache-control")) headers.set("Cache-Control", "no-store");
		// Always allow range if upstream did
		const status = upstream.status === 206 ? 206 : 200;

		return new NextResponse(upstream.body, { status, headers });
	} catch (err) {
		const msg = err instanceof Error ? err.message : "internal error";
		return NextResponse.json({ ok: false, error: msg }, { status: 500 });
	}
}
