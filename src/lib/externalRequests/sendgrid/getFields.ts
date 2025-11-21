import client from "@sendgrid/client";

// ! Important: Type for API response
// * Type-safe SendGrid field definition based on SendGrid API docs
export interface SendGridFieldDefinition {
	id: string;
	name: string;
	field_type: string;
	read_only: boolean;
	reserved: boolean;
	[key: string]: unknown; // * Allow extra properties for forward compatibility
}

export interface SendGridFieldDefinitions {
	custom_fields: Array<SendGridFieldDefinition>;
	reserved_fields: Array<SendGridFieldDefinition>;
	_metadata?: Record<string, unknown>;
}

/**
 * Fetch all SendGrid custom and reserved field definitions.
 * @returns {Promise<SendGridFieldDefinitions>}
 */
export async function getSendGridFields(): Promise<SendGridFieldDefinitions> {
	const apiKey =
		process.env.SENDGRID_API_KEY || process.env.SENDGRID_TEST_API_KEY;
	if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");
	client.setApiKey(apiKey);

	const request: import("@sendgrid/client/src/request").ClientRequest = {
		url: "/v3/marketing/field_definitions",
		method: "GET" as const,
	};

	try {
		const [response, body] = await client.request(request);
		if (response.statusCode !== 200) {
			throw new Error(`SendGrid API error: ${response.statusCode}`);
		}
		return body as SendGridFieldDefinitions;
	} catch (error) {
		// ! Error handling
		console.error("[getSendGridFields] Error:", error);
		throw error;
	}
}
