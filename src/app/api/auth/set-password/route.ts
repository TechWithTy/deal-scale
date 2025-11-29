import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface SetPasswordRequest {
	email: string;
	token: string;
	new_password: string;
	confirm_password: string;
}

/**
 * Complete reset with token - Matches Integration Plan
 *
 * BDD Scenario: Secure Password Reset Completion
 * Given a user has a valid reset token
 * When they submit new password with token
 * Then password is updated securely
 * And all existing sessions are invalidated
 */
export async function POST(req: NextRequest) {
	try {
		const body: SetPasswordRequest = await req.json();
		const { email, token, new_password, confirm_password } = body;

		// Validate required fields
		if (!email || !token || !new_password || !confirm_password) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: email, token, new_password, and confirm_password are required",
				},
				{ status: 400 },
			);
		}

		// Validate password confirmation
		if (new_password !== confirm_password) {
			return NextResponse.json(
				{ error: "Passwords do not match" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to set new password
		const setPasswordResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/set-password`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					token,
					new_password,
					confirm_password,
				}),
			},
		);

		if (!setPasswordResponse.ok) {
			let errorMessage = "Failed to set new password";
			try {
				const errorData = await setPasswordResponse.json();
				errorMessage = errorData?.detail ?? errorData?.message ?? errorMessage;
			} catch {
				errorMessage = setPasswordResponse.statusText || errorMessage;
			}

			return NextResponse.json(
				{ error: errorMessage },
				{ status: setPasswordResponse.status },
			);
		}

		const data = await setPasswordResponse.json();

		return NextResponse.json({
			message: "Password updated successfully",
			success: true,
			...data,
		});
	} catch (error) {
		console.error("Set password error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
