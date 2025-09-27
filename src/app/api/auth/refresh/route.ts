import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface RefreshTokenRequest {
	refresh_token: string;
}

interface DealScaleAuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	user: Record<string, unknown>;
	session_id: string;
	profile_setup_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

/**
 * Refresh access token using refresh token
 *
 * BDD Scenario: Seamless Token Refresh
 * Given a user has a valid refresh token
 * When their access token expires
 * Then a new access token is issued
 * And the session remains active
 */
export async function POST(req: NextRequest) {
	try {
		const body: RefreshTokenRequest = await req.json();
		const { refresh_token } = body;

		// Validate required fields
		if (!refresh_token) {
			return NextResponse.json(
				{ error: "Missing required field: refresh_token" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to refresh token
		const refreshResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					refresh_token,
				}),
			},
		);

		if (!refreshResponse.ok) {
			let errorMessage = "Failed to refresh token";
			try {
				const errorData = await refreshResponse.json();
				errorMessage = errorData?.detail ?? errorData?.message ?? errorMessage;
			} catch {
				errorMessage = refreshResponse.statusText || errorMessage;
			}

			return NextResponse.json(
				{ error: errorMessage },
				{ status: refreshResponse.status },
			);
		}

		const data: DealScaleAuthResponse = await refreshResponse.json();

		return NextResponse.json({
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			token_type: data.token_type,
			expires_in: data.expires_in,
			user: data.user,
			session_id: data.session_id,
			profile_setup_status: data.profile_setup_status,
		});
	} catch (error) {
		console.error("Token refresh error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
