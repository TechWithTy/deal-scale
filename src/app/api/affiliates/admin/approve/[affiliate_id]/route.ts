import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

type RouteContext = {
	params: Promise<{
		affiliate_id: string;
	}>;
};

/**
 * Handles admin affiliate approval requests by forwarding them to the DealScale backend API.
 * Ensures the caller is authenticated with the necessary DealScale access tokens.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { affiliate_id } = await params;
		const { searchParams } = new URL(request.url);
		const oauthToken = searchParams.get("oauth_token");

		const queryParams = new URLSearchParams();
		if (oauthToken) queryParams.append("oauth_token", oauthToken);

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/affiliates/${affiliate_id}/approve${
				queryParams.size > 0 ? `?${queryParams.toString()}` : ""
			}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: errorData.error || "Failed to approve affiliate" },
				{ status: response.status },
			);
		}

		return NextResponse.json(
			{ message: "Affiliate approved successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error approving affiliate:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
