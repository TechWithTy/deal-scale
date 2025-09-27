import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type {
	TesterApplicationRequest,
	TesterType,
} from "../../../../types/testers";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Apply for beta or pilot tester program.
 *
 * Requirements:
 * - Must be logged in
 * - Terms must be accepted
 * - Cannot have existing active application of same type
 *
 * Process:
 * - Validates application data
 * - Checks for existing applications
 * - Creates tester record with 'applied' status
 * - Triggers notification to admins
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const body: TesterApplicationRequest = await req.json();

		// Validate required fields
		if (
			!body.tester_type ||
			!body.company ||
			!body.icp_type ||
			!body.employee_count ||
			!body.deals_closed_last_year ||
			!body.pain_points ||
			!body.terms_accepted
		) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: tester_type, company, icp_type, employee_count, deals_closed_last_year, pain_points, and terms_accepted are required",
				},
				{ status: 400 },
			);
		}

		// Validate tester_type
		const allowedTesterTypes: TesterType[] = ["beta", "pilot"];
		if (!allowedTesterTypes.includes(body.tester_type)) {
			return NextResponse.json(
				{
					error: `Invalid tester_type. Must be one of: ${allowedTesterTypes.join(", ")}`,
				},
				{ status: 400 },
			);
		}

		// Build query string
		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to apply for tester program
		const applyResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/testers/apply${queryString ? `?${queryString}` : ""}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!applyResponse.ok) {
			console.error(
				"Failed to apply for tester program:",
				applyResponse.status,
				await applyResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to apply for tester program" },
				{ status: 500 },
			);
		}

		const data = await applyResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Tester application error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
