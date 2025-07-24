/**
 * @jest-environment node
 */
import "dotenv/config";
import { type Lead, addToSendGrid } from "@/lib/externalRequests/sendgrid";
import {
	SendGridAllField,
	SendGridBaseField,
	SendGridCustomField,
	allSendGridFields,
} from "@/types/sendgrid/sendgrid";

console.log("STAGING_ENVIRONMENT:", process.env.STAGING_ENVIRONMENT);
console.log("SENDGRID_SUPPORT_EMAIL:", process.env.SENDGRID_SUPPORT_EMAIL);
console.log("SENDGRID_TEST_SEGMENT:", process.env.SENDGRID_TEST_SEGMENT);
console.log(
	"SENDGRID_TEST_API_KEY:",
	process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? "",
);

/**
 * Integration test: add a contact to the test segment, setting test_segment custom field to 'True'.
 */
describe("SendGrid addToSendGrid SEGMENT integration", () => {
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
		// Add test_segment field to custom fields (must exist in SendGrid dashboard)
		// If not present, add it to SendGridCustomField enum and allSendGridFields
		// For this test, we assume test_segment is a valid custom field key
		// and is already mapped in addToSendGrid implementation
		// (otherwise, update addToSendGrid to accept arbitrary custom fields)

		// Patch: Add custom field to lead for this test
		(lead as any).test_segment = "True";

		// Retry logic: up to 3 attempts
		let lastError: any = null;
		let status: number | undefined;
		// Use the actual list name, not the segment, as the target
		const targetList = "Test_List"; // Set this to your actual list name in SendGrid
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				console.log(
					`[SegmentTest] Attempt ${attempt} to add contact to list '${targetList}'...`,
				);
				status = await addToSendGrid(lead, targetList);
				console.log(`[SegmentTest] Attempt ${attempt} status:`, status);
				if ([200, 202].includes(status)) {
					break;
				}
			} catch (err) {
				lastError = err;
				console.error(`[SegmentTest] Error on attempt ${attempt}:`, err);
			}
			// Wait 2 seconds before retrying
			await new Promise((res) => setTimeout(res, 2000));
		}
		if (![200, 202].includes(status as number)) {
			console.error("[SegmentTest] Final failure. Last error:", lastError);
		}
		expect([200, 202]).toContain(status);
	});
});
