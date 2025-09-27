import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const response = await fetch(`${DEALSCALE_API_BASE}/api/v1/cart/products`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${session.dsTokens.access_token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.error(
				"Failed to get cart products:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get cart products" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Get cart products error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
