import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

/**
 * Transfer credits between users or accounts.
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		// Call DealScale backend API to transfer credits
		const transferResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credits/transfer`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);

		if (!transferResponse.ok) {
			console.error(
				"Failed to transfer credits:",
				transferResponse.status,
				await transferResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to transfer credits" },
				{ status: 500 },
			);
		}

		const data = await transferResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Credit transfer error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
