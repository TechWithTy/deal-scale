export interface CompanyEnrichmentRequest {
	name: string;
	domain?: string;
}

export interface CompanyEnrichmentResponse {
	name: string;
	domain: string;
	description: string;
	founded_year: number;
	// ... other fields
}

export interface ContactEnrichmentRequest {
	email?: string;
	phone?: string;
	linkedin_url?: string;
}

export interface ContactEnrichmentResponse {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	// ... other fields
}

export interface VerificationRequest {
	email?: string;
	phone?: string;
}

export interface VerificationResponse {
	valid: boolean;
	// ... other verification details
}
