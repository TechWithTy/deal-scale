import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		// Revalidate the linktree path (Next.js 16 changed revalidateTag API)
		revalidatePath("/linktree");
		return NextResponse.json({ ok: true });
	} catch (err) {
		const msg = err instanceof Error ? err.message : "revalidate failed";
		return NextResponse.json({ ok: false, error: msg }, { status: 500 });
	}
}
