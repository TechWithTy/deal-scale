import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type { TesterType } from "../../../../types/testers";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Get pending tester applications for admin review.
 *
 * Admin Only
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const testerType = searchParams.get("tester_type") as TesterType;
		const limit = searchParams.get("limit");

		// Get required scopes from request body
		let requiredScopes: string[] = [];
		try {
			const body = await req.json();
			requiredScopes = Array.isArray(body) ? body : [];
		} catch {
			// No body or invalid JSON, continue with empty scopes
		}

		// Validate tester_type if provided
		if (testerType) {
			const allowedTesterTypes: TesterType[] = ["beta", "pilot"];
			if (!allowedTesterTypes.includes(testerType)) {
				return NextResponse.json(
					{
						error: `Invalid tester_type. Must be one of: ${allowedTesterTypes.join(", ")}`,
					},
					{ status: 400 },
				);
			}
		}

		// Validate limit if provided
		if (limit && (Number.isNaN(Number(limit)) || Number(limit) <= 0)) {
			return NextResponse.json(
				{ error: "Invalid limit parameter. Must be a positive integer." },
				{ status: 400 },
			);
		}

		// Build query string
		const queryParams = new URLSearchParams();
		if (testerType) {
			queryParams.append("tester_type", testerType);
		}
		if (limit) {
			queryParams.append("limit", limit);
		}
		const queryString = queryParams.toString();

		// Call DealScale backend API to get pending applications
		const pendingResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/testers/pending${queryString ? `?${queryString}` : ""}`,
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

		if (!pendingResponse.ok) {
			console.error(
				"Failed to get pending applications:",
				pendingResponse.status,
				await pendingResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get pending applications" },
				{ status: 500 },
			);
		}

		const data = await pendingResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Pending applications error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
