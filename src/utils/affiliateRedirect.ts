import type { BetaTesterFormValues } from "@/data/contact/formFields";
import type { PriorityPilotFormValues } from "@/data/contact/pilotFormFields";

/**
 * Builds a redirect URL to the affiliate sign-up page (Step 1 - Application) with non-sensitive form data
 * as URL parameters for prefilling the affiliate application form.
 *
 * Only includes Step 1 fields (qualification only). Banking/payment fields are never included.
 *
 * @param formData - The contact form data (either BetaTesterFormValues or PriorityPilotFormValues)
 * @returns The affiliate sign-up URL with query parameters for Step 1 fields only
 */
export function buildAffiliateRedirectUrl(
	formData: BetaTesterFormValues | PriorityPilotFormValues,
): string {
	const params = new URLSearchParams();

	// Map non-sensitive Step 1 fields that can be prefilled
	// Only include fields that exist in the application form and are safe to pass in URL

	// Newsletter signup preference (maps to newsletterBeta in affiliate form)
	if ("newsletterSignup" in formData && formData.newsletterSignup) {
		params.set("newsletterBeta", "true");
	}

	// Note: We don't include sensitive fields like:
	// - Email, phone, name (handled by auth session)
	// - Bank details (never in URL, only collected in Step 2 after approval)
	// - File uploads (not supported via URL)
	// - All Step 2 (payment) fields are excluded

	const queryString = params.toString();
	return queryString ? `/affiliate?${queryString}` : "/affiliate";
}
