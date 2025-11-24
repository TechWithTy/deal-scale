import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user || !session?.dsTokens?.access_token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const response = await fetch(
		`${DEALSCALE_API_BASE}/api/v1/affiliates/profile`,
		{
			headers: {
				Authorization: `Bearer ${session.dsTokens.access_token}`,
			},
		},
	);

	return NextResponse.json(await response.json());
}
