import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface RouteParams {
	campaign_id: string;
}

/**
 * Get campaign status by campaign ID.
 */
export async function GET(
	req: Request,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { campaign_id } = await params;

		// Validate campaign_id
		if (!campaign_id) {
			return NextResponse.json(
				{ error: "Missing campaign_id parameter" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to get campaign status
		const statusResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/campaigns/${campaign_id}/status`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!statusResponse.ok) {
			console.error(
				"Failed to get campaign status:",
				statusResponse.status,
				await statusResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get campaign status" },
				{ status: 500 },
			);
		}

		const data = await statusResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Campaign status error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
