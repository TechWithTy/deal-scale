import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type {
	EnrichmentRequestBody,
	EnrichmentResponse,
} from "../../../../types/enrichment";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

function validateRequest(body: EnrichmentRequestBody): string | null {
	if (!body || typeof body !== "object") {
		return "Invalid body. Expected enrichment_request and required_scopes.";
	}

	const {
		enrichment_request: enrichmentRequest,
		required_scopes: requiredScopes,
	} = body;
	if (!enrichmentRequest || typeof enrichmentRequest !== "object") {
		return "Missing enrichment_request object.";
	}

	if (!Array.isArray(requiredScopes)) {
		return "required_scopes must be an array.";
	}

	const { lead_id: leadId, tool } = enrichmentRequest;
	if (typeof leadId !== "string" || leadId.trim().length === 0) {
		return "lead_id is required.";
	}

	if (typeof tool !== "string" || tool.trim().length === 0) {
		return "tool is required.";
	}

	return null;
}

/**
 * Enrich an existing lead using the specified OSINT tool.
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = (await req.json()) as EnrichmentRequestBody;
		const validationError = validateRequest(body);
		if (validationError) {
			return NextResponse.json({ error: validationError }, { status: 400 });
		}

		const backendResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/leads/enrich`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!backendResponse.ok) {
			console.error(
				"Enrichment request failed:",
				backendResponse.status,
				await backendResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to enrich lead" },
				{ status: 500 },
			);
		}

		const data = (await backendResponse.json()) as EnrichmentResponse;
		return NextResponse.json(data);
	} catch (error) {
		console.error("Lead enrichment error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
