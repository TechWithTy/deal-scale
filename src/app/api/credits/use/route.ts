import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Use credits for a specific operation.
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		// Call DealScale backend API to use credits
		const useResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credits/use`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!useResponse.ok) {
			console.error(
				"Failed to use credits:",
				useResponse.status,
				await useResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to use credits" },
				{ status: 500 },
			);
		}

		const data = await useResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Credit use error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
