import { authOptions } from "@/lib/authOptions";
import type { VoteRequest } from "@/types/features";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface RouteParams {
	feature_id: string;
}

/**
 * Cast or update a vote on a feature.
 *
 * Requirements:
 * - Must be logged in
 * - Must be approved beta or pilot tester
 *
 * Vote Weights:
 * - Beta testers: 1 point per vote
 * - Pilot testers: 2 points per vote
 *
 * Behavior:
 * - First vote: Creates new vote record
 * - Subsequent votes: Updates existing vote (idempotent)
 * - Vote weight is recalculated based on current tester status
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

		const { feature_id } = await params;
		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const body: VoteRequest = await req.json();

		// Validate required fields
		if (!body.feature_id) {
			return NextResponse.json(
				{ error: "Missing required field: feature_id" },
				{ status: 400 },
			);
		}

		// Validate feature_id matches path parameter
		if (body.feature_id !== feature_id) {
			return NextResponse.json(
				{ error: "feature_id in body must match path parameter" },
				{ status: 400 },
			);
		}

		// Validate comment length if provided
		if (body.comment && body.comment.length > 500) {
			return NextResponse.json(
				{ error: "Comment must be 500 characters or less" },
				{ status: 400 },
			);
		}

		// Build query string
		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to vote on feature
		const voteResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/features/${feature_id}/vote${queryString ? `?${queryString}` : ""}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!voteResponse.ok) {
			console.error(
				"Failed to vote on feature:",
				voteResponse.status,
				await voteResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to vote on feature" },
				{ status: 500 },
			);
		}

		const data = await voteResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Feature vote error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Retract a vote on a feature.
 *
 * Requirements:
 * - Must be logged in
 * - Must have previously voted on the feature
 *
 * Behavior:
 * - Removes the user's vote completely
 * - Updates feature vote totals
 * - Cannot be undone (user must vote again)
 */
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { feature_id } = await params;
		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		// Build query string
		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to retract vote
		const retractResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/features/${feature_id}/vote${queryString ? `?${queryString}` : ""}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!retractResponse.ok) {
			console.error(
				"Failed to retract vote:",
				retractResponse.status,
				await retractResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to retract vote" },
				{ status: 500 },
			);
		}

		const data = await retractResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Vote retraction error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
