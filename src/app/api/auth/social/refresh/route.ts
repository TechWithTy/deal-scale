import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

type OAuthProvider = "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "TWITTER";

/**
 * Refresh OAuth provider tokens for authenticated user
 *
 * OAuth Token Refresh Workflow:
 * 1. Authenticate the caller (Auth.js JWT required)
 * 2. Find OAuth credentials for provider
 * 3. Use refresh_token to get new access_token
 * 4. Update encrypted credentials in database
 * 5. Return 204 No Content
 *
 * Provider Support:
 * - LinkedIn: Uses OAuth 2.0 refresh flow
 * - Facebook: Uses OAuth 2.0 refresh flow
 */
export async function POST(req: NextRequest) {
	try {
		// Authenticate the caller (requires Auth.js JWT)
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get query parameters
		const { searchParams } = new URL(req.url);
		const provider = searchParams.get("provider") as OAuthProvider;

		// Validate required fields
		if (!provider) {
			return NextResponse.json(
				{ error: "Missing required parameter: provider" },
				{ status: 400 },
			);
		}

		// Validate provider is one of the allowed enum values
		const allowedProviders: OAuthProvider[] = [
			"FACEBOOK",
			"INSTAGRAM",
			"LINKEDIN",
			"TWITTER",
		];
		if (!allowedProviders.includes(provider)) {
			return NextResponse.json(
				{
					error: `Invalid provider. Must be one of: ${allowedProviders.join(", ")}`,
				},
				{ status: 400 },
			);
		}

		// Call DealScale backend API to refresh OAuth tokens
		const refreshResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/social/refresh?provider=${provider}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!refreshResponse.ok) {
			console.error(
				"Failed to refresh OAuth tokens:",
				refreshResponse.status,
				await refreshResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to refresh OAuth tokens" },
				{ status: 500 },
			);
		}

		console.log(
			`Successfully refreshed OAuth tokens for user ${session.user.id}, provider ${provider}`,
		);

		// Return 204 No Content
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Social OAuth refresh error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
