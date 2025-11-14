/**
 * Types related to prospecting search endpoints
 */

export type ProspectingSource = "rentcast" | "homeharvest";

export type PropertyType =
	| "SINGLE_FAMILY"
	| "MULTI_FAMILY"
	| "CONDO"
	| "TOWNHOUSE"
	| "LAND"
	| "APARTMENT"
	| "MANUFACTURED"
	| "OTHER";

export interface ProspectingQuery {
	source: ProspectingSource;
	location?: string;
	state?: string;
	city?: string;
	zip?: string;
	min_beds?: number;
	max_beds?: number;
	min_baths?: number;
	max_baths?: number;
	min_price?: number;
	max_price?: number;
	property_type?: PropertyType;
	limit?: number;
	cursor?: string;
	dry_run?: boolean;
}

export interface ProspectingLead {
	lead_id: string;
	mls_number?: string;
	property_address?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	price?: number;
	bedrooms?: number;
	bathrooms?: number;
	square_feet?: number;
	lot_size?: number;
	year_built?: number;
	property_type?: string;
	status?: string;
	agent_name?: string;
	agent_phone?: string;
	agent_email?: string;
	open_house_dates?: string[];
	description?: string;
	images?: string[];
	virtual_tour_url?: string;
	source?: string;
	created_at?: string;
	updated_at?: string;
	tags?: string[];
	[key: string]: unknown;
}

export type ProspectingSearchResponse = ProspectingLead[];

export interface ProspectingSourcesResponse {
	sources: ProspectingSource[];
	metadata?: Record<string, unknown>;
}

export interface ProspectingHealthResponse {
	status: string;
	details?: Record<string, unknown>;
}
