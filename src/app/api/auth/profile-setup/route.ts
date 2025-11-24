import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface ProfileSetupUpdateRequest {
	basic_info_completed?: boolean;
	preferences_set?: boolean;
	payment_method_added?: boolean;
	email_verified?: boolean;
	phone_verified?: boolean;
}

/**
 * Get profile setup progress
 */
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Call DealScale backend API to get profile setup progress
		const profileResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/profile-setup`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!profileResponse.ok) {
			console.error(
				"Failed to get profile setup:",
				profileResponse.status,
				await profileResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get profile setup" },
				{ status: 500 },
			);
		}

		const data = await profileResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Profile setup get error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Update profile setup progress
 *
 * BDD Scenario: Profile Setup Progress Tracking
 * Given a user is completing profile setup
 * When they complete each setup step
 * Then their progress is tracked and saved
 * And completion percentage is updated
 */
export async function PUT(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: ProfileSetupUpdateRequest = await req.json();

		// Call DealScale backend API to update profile setup progress
		const updateResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/profile-setup`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					basic_info_completed: body.basic_info_completed ?? false,
					preferences_set: body.preferences_set ?? false,
					payment_method_added: body.payment_method_added ?? false,
					email_verified: body.email_verified ?? false,
					phone_verified: body.phone_verified ?? false,
				}),
			},
		);

		if (!updateResponse.ok) {
			console.error(
				"Failed to update profile setup:",
				updateResponse.status,
				await updateResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to update profile setup" },
				{ status: 500 },
			);
		}

		const data = await updateResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Profile setup update error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
