import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface RouteParams {
	contact_id: string;
}

/**
 * AI enrichment endpoint for contact data enhancement.
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

		const { contact_id } = await params;
		const body = await req.json();

		// Validate contact_id
		if (!contact_id) {
			return NextResponse.json(
				{ error: "Missing contact_id parameter" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to enrich contact with AI
		const enrichResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/ai/enrich/${contact_id}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!enrichResponse.ok) {
			console.error(
				"Failed to enrich contact with AI:",
				enrichResponse.status,
				await enrichResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to enrich contact with AI" },
				{ status: 500 },
			);
		}

		const data = await enrichResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("AI enrichment error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
