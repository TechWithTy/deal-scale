import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
// src/app/api/api-keys/[key_id]/route.ts
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface RouteParams {
	key_id: string;
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<RouteParams> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { key_id } = await params;
		if (!key_id) {
			return NextResponse.json(
				{ error: "Missing key_id parameter" },
				{ status: 400 },
			);
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const queryParams = new URLSearchParams();
		if (oauthToken) {
			queryParams.append("oauth_token", oauthToken);
		}
		const queryString = queryParams.toString();

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/api-keys/${key_id}${queryString ? `?${queryString}` : ""}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${session.dsTokens.access_token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to revoke API key:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to revoke API key" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true, message: "API key revoked" });
	} catch (error) {
		console.error("Revoke API key error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
