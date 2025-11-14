import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ credential_id: string }> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { credential_id } = await params;
		if (!credential_id) {
			return NextResponse.json(
				{ error: "Missing credential_id" },
				{ status: 400 },
			);
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (oauthToken) {
			headers["X-OAuth-Token"] = oauthToken;
		}

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credential_management/${credential_id}`,
			{
				method: "GET",
				headers,
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to get credential:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to get credential" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Get credential error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ credential_id: string }> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { credential_id } = await params;
		if (!credential_id) {
			return NextResponse.json(
				{ error: "Missing credential_id" },
				{ status: 400 },
			);
		}

		const body = await req.json();
		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (oauthToken) {
			headers["X-OAuth-Token"] = oauthToken;
		}

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credential_management/${credential_id}`,
			{
				method: "PUT",
				headers,
				body: JSON.stringify(body),
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to update credential:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to update credential" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Update credential error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ credential_id: string }> },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { credential_id } = await params;
		if (!credential_id) {
			return NextResponse.json(
				{ error: "Missing credential_id" },
				{ status: 400 },
			);
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (oauthToken) {
			headers["X-OAuth-Token"] = oauthToken;
		}

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/credential_management/${credential_id}`,
			{
				method: "DELETE",
				headers,
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to delete credential:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to delete credential" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete credential error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
