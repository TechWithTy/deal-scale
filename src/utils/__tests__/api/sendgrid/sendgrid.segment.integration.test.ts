/**
 * @jest-environment node
 */
import "dotenv/config";
import type { Lead } from "@/lib/externalRequests/sendgrid";
import {
	describeIfExternal,
	isExternalIntegrationEnabled,
	skipExternalTest,
} from "../../../testHelpers/external";

console.log("STAGING_ENVIRONMENT:", process.env.STAGING_ENVIRONMENT);
console.log("SENDGRID_SUPPORT_EMAIL:", process.env.SENDGRID_SUPPORT_EMAIL);
console.log("SENDGRID_TEST_SEGMENT:", process.env.SENDGRID_TEST_SEGMENT);
console.log(
	"SENDGRID_TEST_API_KEY:",
	process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? "",
);

type AddToSendGridFn = typeof import("@/lib/externalRequests/sendgrid");
["addToSendGrid"];

let addToSendGridImpl: AddToSendGridFn | undefined;
if (isExternalIntegrationEnabled) {
	({
		addToSendGrid: addToSendGridImpl,
	} = require("@/lib/externalRequests/sendgrid"));
}

skipExternalTest("SendGrid addToSendGrid SEGMENT integration");
describeIfExternal("SendGrid addToSendGrid SEGMENT integration", () => {
	it("adds a contact to the SENDGRID_TEST_SEGMENT with test_segment custom field set to True", async () => {
		const testEmail = `segment-test-${Date.now()}@dealscale.io`;
		const lead: Lead = {
			firstName: "Segment",
			lastName: "Tester",
			companyName: "Deal Scale",
			landingPage: "https://dealscale.io",
			email: testEmail,
			phone: "555-555-5555",
			postal_code: "94102",
			selectedService: "SegmentTest",
			message: "Testing segment integration.",
			termsAccepted: true,
			startupStage: "Seed",
			fundingRaised: "None",
			timeline: "Q3",
			budget: "Test",
			newsletterSignup: false,
			files: [],
		};
		(lead as any).test_segment = "True";

		const targetList = "Test_List";
		let lastError: unknown = null;
		let status: number | undefined;
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				console.log(
					`[SegmentTest] Attempt ${attempt} to add contact to list '${targetList}'...`,
				);
				status = await addToSendGridImpl!(lead, targetList);
				console.log(`[SegmentTest] Attempt ${attempt} status:`, status);
				if ([200, 202].includes(status)) {
					break;
				}
			} catch (err) {
				lastError = err;
				console.error(`[SegmentTest] Error on attempt ${attempt}:`, err);
			}
			await new Promise((res) => setTimeout(res, 2000));
		}
		if (![200, 202].includes(status as number)) {
			console.error("[SegmentTest] Final failure. Last error:", lastError);
		}
		expect([200, 202]).toContain(status);
	});
});
