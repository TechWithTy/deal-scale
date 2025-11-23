import { authOptions } from "@/lib/authOptions";
import type { TesterApprovalRequestBody } from "@/types/testers";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface RouteParams {
	tester_id: string;
}

/**
 * Approve a tester application and allocate credits.
 *
 * Admin Only
 *
 * Process:
 * - Validates tester application exists
 * - Updates status to 'approved'
 * - Allocates free credits (5 for beta, 20 for pilot)
 * - Sends approval notification to applicant
 *
 * Credit Allocation:
 * - Beta testers: 5 AI credits
 * - Pilot testers: 20 AI credits
 * - Credits are immediately available
 */
export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { tester_id } = await params;
		const body: TesterApprovalRequestBody = await req.json();

		// Validate required fields
		if (
			!body.approval_request ||
			typeof body.approval_request.initial_credits !== "number"
		) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: approval_request with initial_credits",
				},
				{ status: 400 },
			);
		}

		// Validate tester_id
		if (!tester_id) {
			return NextResponse.json(
				{ error: "Missing tester_id parameter" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to approve tester
		const approveResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/testers/${tester_id}/approve`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!approveResponse.ok) {
			console.error(
				"Failed to approve tester:",
				approveResponse.status,
				await approveResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to approve tester" },
				{ status: 500 },
			);
		}

		const data = await approveResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Tester approval error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
