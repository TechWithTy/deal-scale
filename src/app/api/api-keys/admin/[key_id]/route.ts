import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
// src/app/api/api-keys/admin/[key_id]/route.ts
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

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

		const headers = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/api-keys/admin/${key_id}`,
			{
				method: "DELETE",
				headers,
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to admin-revoke API key:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to revoke API key" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "API key revoked by admin",
		});
	} catch (error) {
		console.error("Admin revoke API key error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
