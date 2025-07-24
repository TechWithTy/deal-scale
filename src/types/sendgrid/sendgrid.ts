// ! SendGrid Custom Field Enum and Type Mapping
// * This enum and type describes all available SendGrid custom fields (excluding reserved fields)
// * Each entry includes a unique identifier and its value type (always 'text' for custom fields)
// * Reserved fields are commented out for clarity

export enum SendGridBaseField {
	// GENERAL
	first_name = "first_name", // text, Reserved
	last_name = "last_name", // text, Reserved

	// IDENTIFIER
	email = "email", // text, Reserved
	phone_number_id = "phone_number_id", // text, Reserved
	external_id = "external_id", // text, Reserved
	anonymous_id = "anonymous_id", // text, Reserved

	// ADDRESS
	address_line_1 = "address_line_1", // text, Reserved
	address_line_2 = "address_line_2", // text, Reserved
	city = "city", // text, Reserved
	state_province_region = "state_province_region", // text, Reserved
	postal_code = "postal_code", // text, Reserved
	country = "country", // text, Reserved

	// ADDITIONAL
	alternate_emails = "alternate_emails", // text, Reserved
	phone_number = "phone_number", // text, Reserved
	whatsapp = "whatsapp", // text, Reserved
	line = "line", // text, Reserved
	facebook = "facebook", // text, Reserved
	unique_name = "unique_name", // text, Reserved
}

export enum SendGridCustomField {
	affiliate_id = "affiliate_id",
	affiliate_member = "affiliate_member",
	agree_terms = "agree_terms",
	bank_name = "bank_name",
	beta_tester = "beta_tester",
	billing_address = "billing_address",
	business_email = "business_email",
	company_name = "company_name",
	cookies = "cookies",
	current_crm = "current_crm",
	deals_closed_in_last_year = "deals_closed_in_last_year",
	direct_real_estate_experience = "direct_real_estate_experience",
	discount_code = "discount_code",
	features_interested = "features_interested",
	features_voted_on = "features_voted_on",
	how_did_you_find_us = "how_did_you_find_us",
	huge_win = "huge_win",
	industry_niche = "industry_niche",
	nda = "nda",
	network_size = "network_size",
	newsletter_signup = "newsletter_signup",
	pain_points = "pain_points",
	pilot_member = "pilot_member",
	primary_sources_for_deals = "primary_sources_for_deals",
	privacy = "privacy",
	product_description = "product_description",
	product_features = "product_features",
	product_license = "product_license",
	product_options = "product_options",
	product_pain_points = "product_pain_points",
	product_solutions = "product_solutions",
	product_title = "product_title",
	referring_url = "referring_url",
	shipping_address = "shipping_address",
	social_handle = "social_handle",
	source_url = "source_url",
	team_size = "team_size",
	terms = "terms",
	website = "website",
	test_segment = "test_segment",
}

export enum SendGridDataTypes {
	text = "text",
	number = "number",
	date = "date",
}

// Union type for all valid SendGrid fields (base and custom)
export type SendGridAllField = SendGridBaseField | SendGridCustomField;

// Convenience array of all possible field keys
export const allSendGridFields: SendGridAllField[] = [
	...Object.values(SendGridBaseField),
	...Object.values(SendGridCustomField),
];

// Reserved fields (for reference only, do not use as custom fields):
// first_name, last_name, email, phone_number_id, external_id, anonymous_id,
// address_line_1, address_line_2, city, state_province_region, postal_code, country,
// alternate_emails, phone_number, whatsapp, line, facebook, unique_name

// Usage Example:
// const field: SendGridCustomField = SendGridCustomField.company_name;
// const valueType: SendGridCustomFieldType = "text";
