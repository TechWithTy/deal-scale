/**
 * @jest-environment node
 */
import "dotenv/config";
import {
	describeIfExternal,
	isExternalIntegrationEnabled,
	skipExternalTest,
} from "../../../testHelpers/external";

type GetSendGridFieldsFn = (typeof import("@/lib/externalRequests/sendgrid/getFields"))["getSendGridFields"];

let getSendGridFieldsImpl: GetSendGridFieldsFn | undefined;
if (isExternalIntegrationEnabled) {
	({
		getSendGridFields: getSendGridFieldsImpl,
	} = require("@/lib/externalRequests/sendgrid/getFields"));
}

skipExternalTest("SendGrid getFields integration");
describeIfExternal("SendGrid getFields integration", () => {
	it("fetches all custom and reserved fields from SendGrid", async () => {
		const result = await getSendGridFieldsImpl!();
		console.log("SendGrid field definitions:", JSON.stringify(result, null, 2));
		expect(result).toHaveProperty("custom_fields");
		expect(Array.isArray(result.custom_fields)).toBe(true);
		expect(result).toHaveProperty("reserved_fields");
		expect(Array.isArray(result.reserved_fields)).toBe(true);
		const reservedNames = result.reserved_fields.map((f: any) => f.name);
		expect(reservedNames).toContain("automation_id");
	});
});
