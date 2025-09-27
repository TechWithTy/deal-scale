import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type {
	CreateApiKeyRequest,
	CreateApiKeyResponse,
	ListApiKeysResponse,
} from "../../../types/api-keys";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

function validateCreateRequest(body: CreateApiKeyRequest): string | null {
	if (
		!body.name ||
		typeof body.name !== "string" ||
		body.name.trim().length === 0
	) {
		return "name is required and must be a non-empty string.";
	}

	if (body.name.length > 100) {
		return "name must be at most 100 characters.";
	}

	if (
		body.description &&
		(typeof body.description !== "string" || body.description.length > 500)
	) {
		return "description must be a string of at most 500 characters.";
	}

	if (body.expires_in_days !== undefined) {
		if (
			typeof body.expires_in_days !== "number" ||
			body.expires_in_days < 1 ||
			body.expires_in_days > 365
		) {
			return "expires_in_days must be an integer between 1 and 365.";
		}
	}

	if (!Array.isArray(body.scopes) || body.scopes.length === 0) {
		return "scopes must be a non-empty array.";
	}

	if (
		!body.scopes.every(
			(scope) => typeof scope === "string" && scope.trim().length > 0,
		)
	) {
		return "all scopes must be non-empty strings.";
	}

	return null;
}

/**
 * Create a new API key for the authenticated user with specified scopes.
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const oauthToken = searchParams.get("oauth_token");

		const body = (await req.json()) as CreateApiKeyRequest;
		const validationError = validateCreateRequest(body);
		if (validationError) {
			return NextResponse.json({ error: validationError }, { status: 400 });
		}

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (oauthToken) {
			headers["X-OAuth-Token"] = oauthToken;
		}

		const response = await fetch(`${DEALSCALE_API_BASE}/api/v1/api-keys/`, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			console.error(
				"Failed to create API key:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to create API key" },
				{ status: 500 },
			);
		}

		const data = (await response.json()) as CreateApiKeyResponse;
		return NextResponse.json(data);
	} catch (error) {
		console.error("Create API key error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * List all API keys for the authenticated user.
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

		const response = await fetch(`${DEALSCALE_API_BASE}/api/v1/api-keys/`, {
			method: "GET",
			headers,
		});

		if (!response.ok) {
			console.error(
				"Failed to list API keys:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to list API keys" },
				{ status: 500 },
			);
		}

		const data = (await response.json()) as ListApiKeysResponse;
		return NextResponse.json(data);
	} catch (error) {
		console.error("List API keys error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
