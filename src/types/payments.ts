/**
 * Payment and credit management type definitions
 */

export type CreditType = "lead" | "ai" | "skip_trace" | "custom";

export interface PricingTier {
	id: string;
	name: string;
	credits: number;
	price: number;
	discount_percentage?: number;
	savings?: number;
	popular?: boolean;
	description?: string;
}

export interface PricingTiersResponse {
	tiers: PricingTier[];
	currency: string;
	base_price_per_credit: number;
	bulk_discounts: BulkDiscount[];
}

export interface BulkDiscount {
	min_credits: number;
	discount_percentage: number;
	description: string;
}

export interface CreditPricingResponse {
	credits: number;
	credit_type: CreditType;
	price: number;
	base_price: number;
	discount_percentage?: number;
	savings?: number;
	currency: string;
	price_per_credit: number;
}

export interface CreditBalance {
	credit_type: CreditType;
	total_credits: number;
	available_credits: number;
	reserved_credits: number;
	used_credits: number;
	expires_at?: string;
}

export interface CreditBalancesResponse {
	balances: CreditBalance[];
	total_available: number;
	total_reserved: number;
	total_used: number;
	last_updated: string;
}

export interface CreateCheckoutSessionRequest {
	credits: number;
	credit_type: CreditType;
	success_url: string;
	cancel_url: string;
	metadata?: Record<string, unknown>;
}

export interface CheckoutSessionResponse {
	session_id: string;
	session_url: string;
	public_key: string;
	amount: number;
	credits: number;
}

export interface StripeWebhookEvent {
	id: string;
	type: string;
	data: {
		object: Record<string, unknown>;
	};
	created: number;
	livemode: boolean;
}

export interface WebhookProcessingResult {
	success: boolean;
	event_type: string;
	processed_at: string;
	message?: string;
	error?: string;
}
