import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get all available API key scopes with descriptions.
 */
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(
			`http://dummy.com?${new URLSearchParams()}`,
		);
		const oauthToken = searchParams.get("oauth_token");

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (oauthToken) {
			headers["X-OAuth-Token"] = oauthToken;
		}

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/api-keys/scopes`,
			{
				method: "GET",
				headers,
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to get API key scopes:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get API key scopes" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("API key scopes error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
