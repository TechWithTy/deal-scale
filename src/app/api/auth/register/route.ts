import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface SignUpRequest {
	email: string;
	password: string;
	confirm_password: string;
	first_name: string;
	last_name: string;
	device_info?: Record<string, unknown>;
	oauth_provider?: "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "TWITTER";
	oauth_code?: string;
	oauth_state?: string;
}

interface DealScaleSignUpResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	user: Record<string, unknown>;
	session_id: string;
	profile_setup_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

interface ValidationError {
	loc: string[];
	msg: string;
	type: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: SignUpRequest = await request.json();

		// Validate required fields
		const { email, password, confirm_password, first_name, last_name } = body;

		if (!email || !password || !confirm_password || !first_name || !last_name) {
			return NextResponse.json(
				{
					message:
						"Missing required fields: email, password, confirm_password, first_name, last_name",
				},
				{ status: 400 },
			);
		}

		if (password !== confirm_password) {
			return NextResponse.json(
				{ message: "Passwords do not match" },
				{ status: 400 },
			);
		}

		// Call DealScale signup API
		const res = await fetch(`${DEALSCALE_API_BASE}/api/v1/auth/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				password,
				confirm_password,
				first_name,
				last_name,
				device_info: body.device_info || { user_agent: "nextjs-app" },
				...(body.oauth_provider && { oauth_provider: body.oauth_provider }),
				...(body.oauth_code && { oauth_code: body.oauth_code }),
				...(body.oauth_state && { oauth_state: body.oauth_state }),
			}),
		});

		if (!res.ok) {
			let errorMessage = "Failed to create account";
			try {
				const errorData = await res.json();

				// DealScale returns detailed validation errors
				if (errorData?.detail) {
					if (Array.isArray(errorData.detail)) {
						// Handle validation error array format
						const validationErrors = errorData.detail
							.map(
								(err: ValidationError) => `${err.loc?.join(".")}: ${err.msg}`,
							)
							.join(", ");
						errorMessage = validationErrors || errorData.detail;
					} else {
						errorMessage = errorData.detail;
					}
				} else if (errorData?.message) {
					errorMessage = errorData.message;
				}
			} catch {
				// If we can't parse the error, use the status text
				errorMessage = res.statusText || errorMessage;
			}

			return NextResponse.json(
				{ message: errorMessage },
				{ status: res.status },
			);
		}

		const data: DealScaleSignUpResponse = await res.json();

		// Return success response (tokens will be handled by NextAuth after auto-login)
		return NextResponse.json({
			message: "Account created successfully",
			profile_setup_status: data.profile_setup_status,
		});
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
