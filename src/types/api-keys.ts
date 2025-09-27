/**
 * API keys management type definitions
 */

export type CreditType = "lead" | "ai" | "skip_trace" | "custom";

export type CreditAdjustmentReason =
	| "refund"
	| "grant"
	| "purchase"
	| "usage"
	| "admin_adjustment"
	| "promotional"
	| "system"
	| "other";

export interface ApiKeyScopesResponse {
	scopes: Record<string, unknown>;
	user_default_scopes: string[];
	description: string;
}

export interface CreateApiKeyRequest {
	name: string;
	description?: string;
	expires_in_days?: number;
	scopes: string[];
}

export interface CreateApiKeyResponse {
	api_key: string;
	key_id: string;
	name: string;
	scopes: string[];
	expires_at: string;
	warning: string;
}

export interface ApiKeyInfo {
	id: string;
	name: string;
	key_prefix: string;
	scopes: string[];
	created_at: string;
	expires_at?: string;
	last_used_at?: string;
	is_active: boolean;
	metadata?: Record<string, unknown>;
}

export interface ListApiKeysResponse extends Array<ApiKeyInfo> {}

export interface AllocateCreditsRequest {
	amount: number;
	credit_type: CreditType;
	reason: CreditAdjustmentReason;
	user_id: string;
	notes?: string;
}

export interface BulkAllocateCreditsRequest {
	amount: number;
	credit_type: CreditType;
	reason: CreditAdjustmentReason;
	user_ids: string[];
	notes?: string;
}

export interface RevokeCreditsRequest {
	allocation_id: string;
	reason?: string;
}

export interface CreditTransaction {
	id: string;
	user_id: string;
	credit_type: string;
	amount: number;
	balance_before: number;
	balance_after: number;
	reason: string;
	notes?: string;
	created_at: string;
}

export interface CreditHistoryResponse extends Array<CreditTransaction> {}

export interface UseCreditsRequest {
	credit_type: CreditType;
	amount: number;
	service: string;
	metadata?: Record<string, unknown>;
}

export interface TransferCreditsRequest {
	recipient_user_id: string;
	credit_type: CreditType;
	amount: number;
	notes?: string;
}

export interface CreditBalance {
	[key: string]: number;
}

export interface ExpiringCreditsResponse extends Array<unknown> {}

export interface CreditStatsResponse {
	[key: string]: unknown;
}

export interface AdminCreditStatsResponse {
	[key: string]: unknown;
}
