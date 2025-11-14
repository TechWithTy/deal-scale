import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Simple debug endpoint to test if credits router works.
 */
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Call DealScale backend API for debug test
		const debugResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credits/debug-test`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!debugResponse.ok) {
			console.error(
				"Failed to call credits debug test:",
				debugResponse.status,
				await debugResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to call debug test" },
				{ status: 500 },
			);
		}

		const data = await debugResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Credits debug test error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
