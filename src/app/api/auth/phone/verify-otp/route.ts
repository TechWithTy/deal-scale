import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface VerifyOtpRequest {
	phone_number: string;
	otp_code: string;
	device_info?: Record<string, unknown>;
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

export async function POST(request: NextRequest) {
	try {
		const body: VerifyOtpRequest = await request.json();

		if (!body.phone_number || !body.otp_code) {
			return NextResponse.json(
				{ message: "Phone number and OTP code are required" },
				{ status: 400 },
			);
		}

		// Call DealScale verify OTP API
		const res = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/phone/verify-otp`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					phone_number: body.phone_number,
					otp_code: body.otp_code,
					device_info: body.device_info || { user_agent: "nextjs-app" },
				}),
			},
		);

		if (!res.ok) {
			let errorMessage = "Invalid OTP code";
			try {
				const errorData = await res.json();
				errorMessage = errorData?.detail ?? errorData?.message ?? errorMessage;
			} catch {
				errorMessage = res.statusText || errorMessage;
			}

			return NextResponse.json(
				{ message: errorMessage },
				{ status: res.status },
			);
		}

		const data: DealScaleAuthResponse = await res.json();

		// Return the auth response for NextAuth to handle
		return NextResponse.json({
			message: "Phone verification successful",
			authData: data,
		});
	} catch (error) {
		console.error("Verify OTP error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
