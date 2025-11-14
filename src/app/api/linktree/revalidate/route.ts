import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		revalidateTag("link-tree");
		return NextResponse.json({ ok: true });
	} catch (err) {
		const msg = err instanceof Error ? err.message : "revalidate failed";
		return NextResponse.json({ ok: false, error: msg }, { status: 500 });
	}
}
