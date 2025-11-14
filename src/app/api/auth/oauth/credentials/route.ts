import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Get user's OAuth credentials (without exposing tokens)
 *
 * Secure OAuth Credential Listing
 * - Returns provider connection status
 * - Never exposes actual tokens
 * - Shows token expiration status
 */
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Call DealScale backend API to get OAuth credentials
		const credentialsResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/oauth/credentials`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!credentialsResponse.ok) {
			console.error(
				"Failed to get OAuth credentials:",
				credentialsResponse.status,
				await credentialsResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get OAuth credentials" },
				{ status: 500 },
			);
		}

		const data = await credentialsResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("OAuth credentials error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
