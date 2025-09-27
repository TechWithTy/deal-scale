import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

async function parseRequiredScopes(req: Request): Promise<string[]> {
	try {
		const clone = req.clone();
		const body = await clone.json();
		return Array.isArray(body)
			? body.filter((scope): scope is string => typeof scope === "string")
			: [];
	} catch {
		return [];
	}
}

/**
 * Get list of all available data sources for prospecting.
 */
export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const requiredScopes = await parseRequiredScopes(req);

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (requiredScopes.length > 0) {
			headers["X-Required-Scopes"] = requiredScopes.join(",");
		}

		const sourcesResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/prospecting/sources`,
			{
				method: "GET",
				headers,
			},
		);

		if (!sourcesResponse.ok) {
			console.error(
				"Failed to fetch prospecting sources:",
				sourcesResponse.status,
				await sourcesResponse.text(),
			);
			return NextResponse.json(
				{ error: "Failed to fetch prospecting sources" },
				{ status: 500 },
			);
		}

		const data = await sourcesResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Prospecting sources error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
