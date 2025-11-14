import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface ContactData {
	[key: string]: unknown;
}

interface ActivationConfig {
	[key: string]: unknown;
}

interface CampaignContext {
	[key: string]: unknown;
}

interface AIActivationRequest {
	contact_data: ContactData;
	activation_config?: ActivationConfig;
	campaign_context?: CampaignContext;
}

/**
 * AI activation endpoint for contact processing.
 *
 * Request payload for AI activation endpoint with contact information and context.
 */
export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ contact_id: string }> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { contact_id } = await params;
		const body: AIActivationRequest = await req.json();

		// Validate required fields
		if (!body.contact_data) {
			return NextResponse.json(
				{ error: "Missing required field: contact_data" },
				{ status: 400 },
			);
		}

		// Validate contact_id
		if (!contact_id) {
			return NextResponse.json(
				{ error: "Missing contact_id parameter" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to activate AI for contact
		const activateResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/ai/activate/${contact_id}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!activateResponse.ok) {
			console.error(
				"Failed to activate AI for contact:",
				activateResponse.status,
				await activateResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to activate AI for contact" },
				{ status: 500 },
			);
		}

		const data = await activateResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("AI activation error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
