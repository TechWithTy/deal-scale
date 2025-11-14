import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type {
	PropertyType,
	ProspectingQuery,
	ProspectingSearchResponse,
	ProspectingSource,
} from "../../../../types/prospecting";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

const ALLOWED_SOURCES: ProspectingSource[] = ["rentcast", "homeharvest"];
const ALLOWED_PROPERTY_TYPES: PropertyType[] = [
	"SINGLE_FAMILY",
	"MULTI_FAMILY",
	"CONDO",
	"TOWNHOUSE",
	"LAND",
	"APARTMENT",
	"MANUFACTURED",
	"OTHER",
];

async function parseRequiredScopes(req: NextRequest): Promise<string[]> {
	try {
		const clone = req.clone();
		const body = await clone.json();
		return Array.isArray(body) ? (body as string[]) : [];
	} catch {
		return [];
	}
}

function parseNumberParam(
	param: string | null,
	options: { min?: number; max?: number; allowFloat?: boolean; field: string },
): number | undefined {
	if (param === null || param === "") {
		return undefined;
	}

	const value = Number(param);
	const isValidNumber =
		Number.isFinite(value) &&
		((options.allowFloat ?? false) ? true : Number.isInteger(value));
	if (!isValidNumber) {
		throw new Error(`Invalid value for ${options.field}.`);
	}

	if (options.min !== undefined && value < options.min) {
		throw new Error(`Invalid value for ${options.field}.`);
	}

	if (options.max !== undefined && value > options.max) {
		throw new Error(`Invalid value for ${options.field}.`);
	}

	return value;
}

function validateAndBuildQuery(
	searchParams: URLSearchParams,
): ProspectingQuery {
	const source = searchParams.get("source") as ProspectingSource | null;
	if (!source || !ALLOWED_SOURCES.includes(source)) {
		throw new Error(
			"Invalid source parameter. Must be one of: rentcast, homeharvest.",
		);
	}

	const query: ProspectingQuery = { source };

	const location = searchParams.get("location");
	if (location && location.trim().length > 0) {
		query.location = location.trim();
	}

	const state = searchParams.get("state");
	if (state && state.trim().length > 0) {
		query.state = state.trim();
	}

	const city = searchParams.get("city");
	if (city && city.trim().length > 0) {
		query.city = city.trim();
	}

	const zip = searchParams.get("zip");
	if (zip && zip.trim().length > 0) {
		query.zip = zip.trim();
	}

	const cursor = searchParams.get("cursor");
	if (cursor && cursor.trim().length > 0) {
		query.cursor = cursor.trim();
	}

	const minBeds = parseNumberParam(searchParams.get("min_beds"), {
		field: "min_beds",
		min: 0,
		max: 20,
	});
	if (minBeds !== undefined) {
		query.min_beds = minBeds;
	}

	const maxBeds = parseNumberParam(searchParams.get("max_beds"), {
		field: "max_beds",
		min: 0,
		max: 20,
	});
	if (maxBeds !== undefined) {
		query.max_beds = maxBeds;
	}

	const minBaths = parseNumberParam(searchParams.get("min_baths"), {
		field: "min_baths",
		min: 0,
		max: 20,
	});
	if (minBaths !== undefined) {
		query.min_baths = minBaths;
	}

	const maxBaths = parseNumberParam(searchParams.get("max_baths"), {
		field: "max_baths",
		min: 0,
		max: 20,
	});
	if (maxBaths !== undefined) {
		query.max_baths = maxBaths;
	}

	const minPrice = parseNumberParam(searchParams.get("min_price"), {
		field: "min_price",
		min: 0,
		allowFloat: true,
	});
	if (minPrice !== undefined) {
		query.min_price = minPrice;
	}

	const maxPrice = parseNumberParam(searchParams.get("max_price"), {
		field: "max_price",
		min: 0,
		allowFloat: true,
	});
	if (maxPrice !== undefined) {
		query.max_price = maxPrice;
	}

	const limit = parseNumberParam(searchParams.get("limit"), {
		field: "limit",
		min: 1,
		max: 100,
	});
	if (limit !== undefined) {
		query.limit = limit;
	}

	const propertyType = searchParams.get("property_type") as PropertyType | null;
	if (propertyType) {
		if (!ALLOWED_PROPERTY_TYPES.includes(propertyType)) {
			throw new Error("Invalid property_type parameter.");
		}
		query.property_type = propertyType;
	}

	const dryRunParam = searchParams.get("dry_run");
	if (dryRunParam !== null) {
		const normalized = dryRunParam.toLowerCase();
		if (normalized !== "true" && normalized !== "false") {
			throw new Error("Invalid dry_run parameter. Must be true or false.");
		}
		query.dry_run = normalized === "true";
	}

	return query;
}

function buildQueryString(query: ProspectingQuery): string {
	const queryParams = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null) {
			queryParams.append(key, String(value));
		}
	}
	return queryParams.toString();
}

/**
 * Search multiple data sources for real estate leads with credit-based billing.
 */
export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user || !session?.dsTokens?.access_token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const requiredScopes = await parseRequiredScopes(req);
		const query = validateAndBuildQuery(new URL(req.url).searchParams);
		const queryString = buildQueryString(query);

		const headers: Record<string, string> = {
			Authorization: `Bearer ${session.dsTokens.access_token}`,
			"Content-Type": "application/json",
		};

		if (requiredScopes.length > 0) {
			headers["X-Required-Scopes"] = requiredScopes.join(",");
		}

		const response = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/prospecting/search${queryString ? `?${queryString}` : ""}`,
			{
				method: "GET",
				headers,
			},
		);

		if (!response.ok) {
			console.error(
				"Failed to search prospecting leads:",
				response.status,
				await response.text(),
			);
			return NextResponse.json(
				{ error: "Failed to search prospecting leads" },
				{ status: 500 },
			);
		}

		const data = (await response.json()) as ProspectingSearchResponse;
		return NextResponse.json(data);
	} catch (error: unknown) {
		console.error("Prospecting search error:", error);
		const message =
			error instanceof Error ? error.message : "Internal server error";
		const status =
			error instanceof Error && message.includes("Invalid") ? 400 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
