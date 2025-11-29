import { authOptions } from "@/lib/authOptions";
import type { ContactData } from "@/utils/csvParser";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

interface ReactivateRequest {
	contacts: ContactData[];
	skipTrace?: boolean;
	workflowRequirements?: string;
}

interface ActivationMetrics {
	dollarAmount: number;
	timeSavedHours: number;
	contactsActivated: number;
	hobbyTimeHours: number;
}

// Constants for calculations
const COST_PER_CONTACT = 25; // Estimated cost per contact in dollars
const TIME_PER_CONTACT_HOURS = 0.25; // Estimated time per contact in hours (15 minutes)

/**
 * Batch activate contacts for campaign reactivation
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		// Allow unauthenticated requests in development mode for testing
		const isDevelopment = process.env.NODE_ENV === "development";
		const hasAuth = session?.user && session?.dsTokens?.access_token;

		if (!isDevelopment && !hasAuth) {
			return NextResponse.json(
				{
					error: "Unauthorized",
					message: "Please sign in to activate campaigns",
				},
				{ status: 401 },
			);
		}

		// Use a mock token in development if no session
		const accessToken = hasAuth
			? session.dsTokens.access_token
			: "dev-mock-token";

		const body: ReactivateRequest = await req.json();

		if (
			!body.contacts ||
			!Array.isArray(body.contacts) ||
			body.contacts.length === 0
		) {
			return NextResponse.json(
				{ error: "Missing or empty contacts array" },
				{ status: 400 },
			);
		}

		const { contacts, skipTrace = false, workflowRequirements } = body;

		// If skip trace is enabled, enrich contacts first
		let enrichedContacts = contacts;
		if (skipTrace && hasAuth) {
			try {
				// Enrich contacts with skip trace data
				enrichedContacts = await enrichContactsWithSkipTrace(
					contacts,
					accessToken,
				);
			} catch (error) {
				console.error("Skip trace enrichment failed:", error);
				// Continue with original contacts if skip trace fails
			}
		}

		// Batch activate contacts
		// In development mode without auth, simulate activation
		let activationResults;
		if (isDevelopment && !hasAuth) {
			// Simulate successful activation for development
			activationResults = contacts.map((contact, index) => ({
				success: true,
				contactId: `dev_${index}_${Date.now()}`,
			}));
		} else {
			activationResults = await batchActivateContacts(
				enrichedContacts,
				accessToken,
				workflowRequirements,
			);
		}

		const successfulActivations = activationResults.filter((r) => r.success);
		const failedActivations = activationResults.filter((r) => !r.success);

		// Calculate metrics
		const contactsActivated = successfulActivations.length;
		const metrics: ActivationMetrics = {
			dollarAmount: contactsActivated * COST_PER_CONTACT,
			timeSavedHours: contactsActivated * TIME_PER_CONTACT_HOURS,
			contactsActivated,
			hobbyTimeHours: contactsActivated * TIME_PER_CONTACT_HOURS, // Same as time saved
		};

		// Log failures if any
		if (failedActivations.length > 0) {
			console.warn(
				`Failed to activate ${failedActivations.length} contacts:`,
				failedActivations,
			);
		}

		return NextResponse.json({
			success: true,
			metrics,
			activated: contactsActivated,
			failed: failedActivations.length,
			errors: failedActivations.map((f) => f.error).filter(Boolean),
		});
	} catch (error) {
		console.error("Campaign reactivation error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 },
		);
	}
}

/**
 * Enrich contacts with skip trace data
 */
async function enrichContactsWithSkipTrace(
	contacts: ContactData[],
	accessToken: string,
): Promise<ContactData[]> {
	try {
		// Enrich contacts using the data enrichment API
		const enrichedContacts: ContactData[] = [];

		for (const contact of contacts) {
			try {
				// If contact has address, use skip trace enrichment
				if (contact.address) {
					const enrichResponse = await fetch(
						`${DEALSCALE_API_BASE}/api/v1/data_enrichment/contacts`,
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${accessToken}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								address: contact.address,
								email: contact.email,
								phone: contact.phone,
								name: contact.name,
							}),
						},
					);

					if (enrichResponse.ok) {
						const enrichedData = await enrichResponse.json();
						enrichedContacts.push({
							...contact,
							...enrichedData,
						});
					} else {
						// If enrichment fails, use original contact
						enrichedContacts.push(contact);
					}
				} else {
					// No address to enrich, use original contact
					enrichedContacts.push(contact);
				}
			} catch (error) {
				console.error("Error enriching contact:", error);
				// On error, use original contact
				enrichedContacts.push(contact);
			}
		}

		return enrichedContacts;
	} catch (error) {
		console.error("Skip trace enrichment error:", error);
		// Return original contacts if enrichment fails
		return contacts;
	}
}

/**
 * Batch activate contacts via AI activation endpoint
 */
async function batchActivateContacts(
	contacts: ContactData[],
	accessToken: string,
	workflowRequirements?: string,
): Promise<Array<{ success: boolean; contactId?: string; error?: string }>> {
	const results: Array<{
		success: boolean;
		contactId?: string;
		error?: string;
	}> = [];

	// Process contacts in batches to avoid overwhelming the API
	const BATCH_SIZE = 10;
	for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
		const batch = contacts.slice(i, i + BATCH_SIZE);

		const batchPromises = batch.map(async (contact) => {
			try {
				// First, create or get contact ID
				const contactId = await getOrCreateContactId(contact, accessToken);

				if (!contactId) {
					return {
						success: false,
						error: "Failed to get/create contact ID",
					};
				}

				// Activate contact via AI activation endpoint
				const activateResponse = await fetch(
					`${DEALSCALE_API_BASE}/api/v1/ai/activate/${contactId}`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							contact_data: contact,
							activation_config: {
								workflow_requirements: workflowRequirements,
							},
							campaign_context: {
								reactivation: true,
								skip_trace: false, // Already handled above
							},
						}),
					},
				);

				if (!activateResponse.ok) {
					const errorText = await activateResponse.text();
					return {
						success: false,
						contactId,
						error: `Activation failed: ${errorText}`,
					};
				}

				return {
					success: true,
					contactId,
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Unknown error during activation",
				};
			}
		});

		const batchResults = await Promise.all(batchPromises);
		results.push(...batchResults);

		// Add a small delay between batches to avoid rate limiting
		if (i + BATCH_SIZE < contacts.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	return results;
}

/**
 * Get or create contact ID from contact data
 * This is a placeholder - implement based on your actual contact management API
 */
async function getOrCreateContactId(
	contact: ContactData,
	accessToken: string,
): Promise<string | null> {
	try {
		// Try to find existing contact by email or phone
		if (contact.email) {
			const searchResponse = await fetch(
				`${DEALSCALE_API_BASE}/api/v1/contacts/search?email=${encodeURIComponent(contact.email)}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (searchResponse.ok) {
				const data = await searchResponse.json();
				if (data.contact_id) {
					return data.contact_id;
				}
			}
		}

		// Create new contact if not found
		const createResponse = await fetch(
			`${DEALSCALE_API_BASE}/api/v1/contacts`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(contact),
			},
		);

		if (createResponse.ok) {
			const data = await createResponse.json();
			return data.contact_id || data.id || null;
		}

		// If creation fails, generate a temporary ID based on contact data
		// This is a fallback - ideally contacts should be created properly
		return contact.email
			? `temp_${contact.email.replace(/[^a-zA-Z0-9]/g, "_")}`
			: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
	} catch (error) {
		console.error("Error getting/creating contact ID:", error);
		// Return a temporary ID as fallback
		return contact.email
			? `temp_${contact.email.replace(/[^a-zA-Z0-9]/g, "_")}`
			: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
	}
}
