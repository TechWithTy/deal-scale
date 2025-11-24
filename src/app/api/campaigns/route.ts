import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Create a new campaign.
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		// Call DealScale backend API to create campaign
		const campaignResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/campaigns/`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!campaignResponse.ok) {
			console.error(
				"Failed to create campaign:",
				campaignResponse.status,
				await campaignResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to create campaign" },
				{ status: 500 },
			);
		}

		const data = await campaignResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Campaign creation error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
