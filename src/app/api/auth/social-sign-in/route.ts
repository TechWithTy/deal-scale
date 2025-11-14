import { authOptions } from "@/lib/authOptions";
import { encryptOAuthToken } from "@/lib/security";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

// Social OAuth linkage endpoint - No session creation
// POST /api/auth/social-sign-in
export async function POST(request: NextRequest) {
	try {
		// Authenticate the caller (requires Auth.js JWT)
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { provider, accessToken, refreshToken, expiresAt } = body;

		// Validate required fields
		if (!provider || !accessToken) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: provider and access_token are required",
				},
				{ status: 400 },
			);
		}

		// Validate provider is one of the allowed enum values
		const allowedProviders = ["FACEBOOK", "INSTAGRAM", "LINKEDIN", "TWITTER"];
		if (!allowedProviders.includes(provider.toUpperCase())) {
			return NextResponse.json(
				{
					error: `Invalid provider. Must be one of: ${allowedProviders.join(", ")}`,
				},
				{ status: 400 },
			);
		}

		try {
			// Save to backend DB
			const encryptedToken = encryptOAuthToken(accessToken);
			const response = await fetch(
				`${DEALSCALE_API_BASE}/api/v1/auth/oauth/credentials`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session.dsTokens?.access_token}`,
					},
					body: JSON.stringify({
						provider: provider.toUpperCase(),
						access_token: encryptedToken,
						refresh_token: refreshToken
							? encryptOAuthToken(refreshToken)
							: null,
						expires_at: expiresAt,
						user_id: session.user.id,
					}),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to save credentials");
			}

			return NextResponse.json({ success: true });
		} catch (error) {
			console.error("Social sign-in error:", error);
			return NextResponse.json(
				{ error: "Credential save failed" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Social sign-in error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
