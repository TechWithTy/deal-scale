import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface SendOtpRequest {
	phone_number: string;
	device_info?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
	try {
		const body: SendOtpRequest = await request.json();

		if (!body.phone_number) {
			return NextResponse.json(
				{ message: "Phone number is required" },
				{ status: 400 },
			);
		}

		// Call DealScale send OTP API
		const res = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/phone/send-otp`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					phone_number: body.phone_number,
					device_info: body.device_info || { user_agent: "nextjs-app" },
				}),
			},
		);

		if (!res.ok) {
			let errorMessage = "Failed to send OTP";
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

		const data = await res.json();

		return NextResponse.json({
			message: "OTP sent successfully",
			...data,
		});
	} catch (error) {
		console.error("Send OTP error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
