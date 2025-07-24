/**
 * @jest-environment node
 */
import "dotenv/config";
import { getSendGridFields } from "@/lib/externalRequests/sendgrid/getFields";

describe("SendGrid getFields integration", () => {
	it("fetches all custom and reserved fields from SendGrid", async () => {
		const result = await getSendGridFields();
		console.log("SendGrid field definitions:", JSON.stringify(result, null, 2));
		expect(result).toHaveProperty("custom_fields");
		expect(Array.isArray(result.custom_fields)).toBe(true);
		expect(result).toHaveProperty("reserved_fields");
		expect(Array.isArray(result.reserved_fields)).toBe(true);
		// Optionally, check for a known reserved field
		const reservedNames = result.reserved_fields.map((f: any) => f.name);
		expect(reservedNames).toContain("automation_id");
	});
});
