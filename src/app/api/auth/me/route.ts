import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface UserProfileResponse {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	email_verified: boolean;
	profile_setup_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
	created_at: string;
	last_login: string;
	total_credits: number;
	available_credits: number;
	reserved_credits: number;
	used_credits: number;
	ai_credits: number;
	lead_credits: number;
	skip_trace_credits: number;
	credit_breakdown: Record<string, unknown>;
}

/**
 * Get current user profile with real database data - supports both JWT and API key authentication
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get required scopes from request body (if any)
		let requiredScopes: string[] = [];
		try {
			const body = await req.json();
			requiredScopes = Array.isArray(body) ? body : [];
		} catch {
			// No body or invalid JSON, continue with empty scopes
		}

		// Call DealScale backend API to get user profile
		const profileResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/auth/me`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body:
					requiredScopes.length > 0
						? JSON.stringify(requiredScopes)
						: undefined,
			},
		);

		if (!profileResponse.ok) {
			console.error(
				"Failed to get user profile:",
				profileResponse.status,
				await profileResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get user profile" },
				{ status: 500 },
			);
		}

		const data: UserProfileResponse = await profileResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("User profile error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
