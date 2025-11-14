import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user || !session?.dsTokens?.access_token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Forward request to DealScale backend
	const response = await fetch(
		`${DEALSCALE_API_BASE}/api/v1/affiliates/debug-test`,
		{
			headers: {
				Authorization: `Bearer ${session.dsTokens.access_token}`,
			},
		},
	);

	return NextResponse.json(await response.json());
}
