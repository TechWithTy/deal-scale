import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * User logout with session invalidation
 *
 * BDD Scenario: Secure Session Termination
 * Given an authenticated user
 * When they choose to logout
 * Then their session is invalidated
 * And access tokens are revoked
 */
export async function POST() {
	try {
		const session = await getServerSession(authOptions);

		if (session?.dsTokens?.access_token) {
			// Call DealScale logout endpoint to invalidate backend session
			try {
				await fetch(`${DEALSCALE_API_BASE}/api/v1/auth/logout`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${session.dsTokens.access_token}`,
						"Content-Type": "application/json",
					},
				});
			} catch (error) {
				console.error("Failed to logout from DealScale backend:", error);
				// Continue with logout even if backend call fails
			}
		}

		// Return success response
		return NextResponse.json({
			message: "Logged out successfully",
			success: true,
		});
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
