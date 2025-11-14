export interface AffiliateApplication {
	company_name: string;
	website?: string;
	audience_size: string;
	traffic_sources: string[];
	promotion_methods: string[];
	experience_level: string;
	expected_monthly_sales: string;
	terms_accepted: boolean;
}

export interface Commission {
	id: string;
	amount: number;
	date: string;
	status: "pending" | "paid" | "cancelled";
}

export interface Payout {
	id: string;
	amount: number;
	date: string;
	method: string;
}

export interface AffiliateProfile {
	total_commissions: number;
	pending_commissions: number;
	referral_count: number;
}

export interface AffiliateStats {
	clicks: number;
	conversions: number;
	conversion_rate: number;
	earnings: number;
}

export interface ReferralLink {
	id: string;
	url: string;
	created_at: string;
}
