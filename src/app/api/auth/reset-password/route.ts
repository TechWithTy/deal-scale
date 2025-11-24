import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface ResetPasswordRequest {
	email: string;
	callbackUrl?: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: ResetPasswordRequest = await request.json();

		if (!body.email) {
			return NextResponse.json(
				{ message: "Email is required" },
				{ status: 400 },
			);
		}

		// Call DealScale reset password API
		const res = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/reset-password`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: body.email,
					reset_url:
						body.callbackUrl ||
						`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password`,
				}),
			},
		);

		if (!res.ok) {
			let errorMessage = "Failed to send reset link";
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
			message: "Reset link sent successfully",
			...data,
		});
	} catch (error) {
		console.error("Reset password error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
