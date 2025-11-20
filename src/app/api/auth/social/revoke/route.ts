import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

type OAuthProvider = "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "TWITTER";

/**
 * Revoke OAuth provider linkage from authenticated user account
 *
 * OAuth Revocation Workflow:
 * 1. Authenticate the caller (Auth.js JWT required)
 * 2. Find and delete OAuth credentials for provider
 * 3. Log security event for audit trail
 * 4. Return 204 No Content
 *
 * Security Features:
 * - Complete credential deletion from database
 * - Audit trail logging
 * - Optional provider-side revocation (future)
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
		const reason = searchParams.get("reason");

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

		// Call DealScale backend API to revoke OAuth credentials
		const revokeResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/social/revoke?provider=${provider}${reason ? `&reason=${encodeURIComponent(reason)}` : ""}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!revokeResponse.ok) {
			console.error(
				"Failed to revoke OAuth credentials:",
				revokeResponse.status,
				await revokeResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to revoke OAuth credentials" },
				{ status: 500 },
			);
		}

		console.log(
			`Successfully revoked OAuth credentials for user ${session.user.id}, provider ${provider}`,
		);

		// Return 204 No Content
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Social OAuth revoke error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
