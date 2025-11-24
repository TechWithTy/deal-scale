import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
// src/app/api/api-keys/admin/all/route.ts
import { NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const headers = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/api-keys/admin/all`,
			{
				method: "GET",
				headers,
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to list all API keys:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to list API keys" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Admin list API keys error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
