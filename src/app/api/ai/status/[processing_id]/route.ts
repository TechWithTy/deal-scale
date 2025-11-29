import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface RouteParams {
	processing_id: string;
}

/**
 * Get AI processing status by processing ID.
 */
export async function GET(
	req: Request,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { processing_id } = await params;

		// Validate processing_id
		if (!processing_id) {
			return NextResponse.json(
				{ error: "Missing processing_id parameter" },
				{ status: 400 },
			);
		}

		// Call DealScale backend API to get AI processing status
		const statusResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/ai/status/${processing_id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!statusResponse.ok) {
			console.error(
				"Failed to get AI processing status:",
				statusResponse.status,
				await statusResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get AI processing status" },
				{ status: 500 },
			);
		}

		const data = await statusResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("AI status error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
