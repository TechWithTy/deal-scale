import { type NextRequest, NextResponse } from "next/server";
import type { FeatureStatus } from "../../../types/features";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Get the feature catalog with current vote counts.
 *
 * Public endpoint - no authentication required for viewing.
 *
 * Query Parameters:
 * - status_filter: Filter by feature status (planned, under_review, etc.)
 * - page: Page number for pagination
 * - per_page: Items per page (max 100)
 *
 * Returns:
 * - List of features with vote counts
 * - Pagination metadata
 * - Features ordered by vote count (most requested first)
 */
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const statusFilter = searchParams.getAll(
			"status_filter",
		) as FeatureStatus[];
		const page = searchParams.get("page");
		const perPage = searchParams.get("per_page");

		// Validate status_filter if provided
		const allowedStatuses: FeatureStatus[] = [
			"planned",
			"under_review",
			"in_development",
			"testing",
			"released",
			"cancelled",
		];
		for (const status of statusFilter) {
			if (!allowedStatuses.includes(status)) {
				return NextResponse.json(
					{
						error: `Invalid status_filter. Must be one of: ${allowedStatuses.join(", ")}`,
					},
					{ status: 400 },
				);
			}
		}

		// Validate page if provided
		if (page && (Number.isNaN(Number(page)) || Number(page) < 1)) {
			return NextResponse.json(
				{ error: "Invalid page parameter. Must be a positive integer." },
				{ status: 400 },
			);
		}

		// Validate per_page if provided
		if (
			perPage &&
			(Number.isNaN(Number(perPage)) ||
				Number(perPage) < 1 ||
				Number(perPage) > 100)
		) {
			return NextResponse.json(
				{ error: "Invalid per_page parameter. Must be between 1 and 100." },
				{ status: 400 },
			);
		}

		// Build query string
		const queryParams = new URLSearchParams();
		for (const status of statusFilter) {
			queryParams.append("status_filter", status);
		}
		if (page) queryParams.append("page", page);
		if (perPage) queryParams.append("per_page", perPage);
		const queryString = queryParams.toString();

		// Call DealScale backend API to get features catalog
		const featuresResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/features${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!featuresResponse.ok) {
			console.error(
				"Failed to get features catalog:",
				featuresResponse.status,
				await featuresResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get features catalog" },
				{ status: 500 },
			);
		}

		const data = await featuresResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Features catalog error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
