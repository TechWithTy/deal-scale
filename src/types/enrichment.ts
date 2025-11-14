/**
 * Types for lead enrichment endpoints
 */

export type EnrichmentTool = string;

export interface EnrichmentRequestPayload {
	lead_id: string;
	tool: EnrichmentTool;
	params?: Record<string, unknown>;
	dry_run?: boolean;
}

export interface EnrichmentRequestBody {
	enrichment_request: EnrichmentRequestPayload;
	required_scopes: string[];
}

export interface CreditCharge {
	type: string;
	charged: number;
	dry_run: boolean;
	balance_before: number;
	balance_after: number;
}

export interface EnrichmentData {
	emails?: string[];
	phones?: string[];
	social?: Record<string, string>;
	addresses?: Record<string, unknown>[];
	company?: Record<string, unknown>;
	profiles?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
	[key: string]: unknown;
}

export interface EnrichmentMeta {
	duration_ms?: number;
	warnings?: string[];
	provider_raw_refs?: Record<string, unknown>;
	provider?: string;
	source_confidence?: number;
	[key: string]: unknown;
}

export interface EnrichmentResponse {
	lead_id: string;
	tool: EnrichmentTool;
	credited?: CreditCharge;
	data?: EnrichmentData;
	meta?: EnrichmentMeta;
}

export interface EnrichmentToolsResponse {
	tools: Record<string, unknown>;
}

export interface EnrichmentHealthResponse {
	status: string;
	details?: Record<string, unknown>;
}
