/**
 * Tester program and user acquisition type definitions
 */

export type TesterType = "beta" | "pilot";
export type TesterStatus =
	| "applied"
	| "approved"
	| "rejected"
	| "started"
	| "completed";

export interface TesterApplicationRequest {
	tester_type: TesterType;
	company: string;
	icp_type: string;
	employee_count: string;
	deals_closed_last_year: string;
	pain_points: string[];
	terms_accepted: boolean;
	current_crm?: string;
	deal_documents?: string[];
	feedback_commitment?: boolean;
	interested_features?: string[];
	payment_agreement?: boolean;
	wanted_features?: string[];
	team_size_acquisitions?: string;
	primary_deal_sources?: string[];
	success_metrics?: string;
}

export interface TesterPII {
	user_id: string;
	first_name: string;
	last_name: string;
	profile_photo_url?: string;
	date_of_birth?: string;
	gender?: string;
}

export interface TesterContact {
	email: string;
	alternate_email?: string;
	phone_number?: string;
	address?: string;
	company_email?: string;
	work_phone?: string;
}

export interface TesterLocation {
	city?: string;
	state?: string;
	country?: string;
	timezone?: string;
	coordinates?: string;
	zip_code?: string;
	address_line1?: string;
	address_line2?: string;
}

export interface Tester {
	user_id: string;
	tester_type: TesterType;
	status: TesterStatus;
	applied_at: string;
	approved_at?: string;
	started_at?: string;
	completed_at?: string;
	notes?: string;
	metadata?: Record<string, unknown>;
	pii?: TesterPII;
	contact?: TesterContact;
	location?: TesterLocation;
}

export interface TesterApplicationResponse {
	success: boolean;
	message: string;
	tester: Tester;
}

export interface TesterStatusResponse {
	user_id: string;
	beta_tester?: Record<string, unknown>;
	pilot_tester?: Record<string, unknown>;
	can_vote_features: boolean;
}

export interface TesterApprovalRequest {
	initial_credits: number;
	notes?: string;
}

export interface TesterApprovalRequestBody {
	approval_request: TesterApprovalRequest;
	required_scopes: string[];
}

export interface PendingApplicationsResponse {
	applications: Tester[];
	total_count: number;
	page?: number;
	per_page?: number;
}
