import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Seed the feature catalog with initial features.
 *
 * Admin Only
 *
 * Seeds the catalog with features from the landing page:
 * - Seamless CRM Integration
 * - Integrated eSignatures
 * - Advanced Lead Scoring
 * - Automated Follow-up Sequences
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get required scopes from request body
		let requiredScopes: string[] = [];
		try {
			const body = await req.json();
			requiredScopes = Array.isArray(body) ? body : [];
		} catch {
			// No body or invalid JSON, continue with empty scopes
		}

		// Call DealScale backend API to seed feature catalog
		const seedResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/features/seed-catalog`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requiredScopes),
			},
		);

		if (!seedResponse.ok) {
			console.error(
				"Failed to seed feature catalog:",
				seedResponse.status,
				await seedResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to seed feature catalog" },
				{ status: 500 },
			);
		}

		const data = await seedResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Seed catalog error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
