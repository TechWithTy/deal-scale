/**
 * @jest-environment node
 */
import "dotenv/config";
console.log("STAGING_ENVIRONMENT:", process.env.STAGING_ENVIRONMENT);
console.log("SENDGRID_SUPPORT_EMAIL:", process.env.SENDGRID_SUPPORT_EMAIL);
console.log("SENDGRID_TEST_EMAIL:", process.env.SENDGRID_TEST_EMAIL);
console.log("SENDGRID_EMAIL:", process.env.SENDGRID_EMAIL);
console.log(
	`SENDGRID_TEST_API_KEY: ${process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? ""}...`,
);
console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);

import { type Lead, addToSendGrid } from "@/lib/externalRequests/sendgrid";
import {
	SendGridBaseField,
	SendGridCustomField,
} from "@/types/sendgrid/sendgrid";

// Combine base and custom fields for robust typing
export type SendGridAllField = SendGridBaseField | SendGridCustomField;

// Example: iterate all fields for dynamic testing
const allSendGridFields: SendGridAllField[] = [
	...Object.values(SendGridBaseField),
	...Object.values(SendGridCustomField),
];

/**
 * REAL integration test for SendGrid addToSendGrid functionality.
 * This will add a lead to a SendGrid list using your configured API key and list name.
 * Ensure you are using TEST keys, test list, and test data!
 */
describe("SendGrid addToSendGrid REAL integration (adds lead to list)", () => {
	const testLead: Lead = {
		firstName: "Test",
		lastName: "Lead",
		companyName: "Test Company",
		landingPage: "https://example.com",
		email: process.env.SENDGRID_SUPPORT_EMAIL!,
		phone: "1234567890",
		state: "CA",
		city: "Testville",
		selectedService: "Testing",
		message: "Integration test lead.",
		termsAccepted: true,
		startupStage: "Seed",
		fundingRaised: "0",
		timeline: "ASAP",
		budget: "$0",
		newsletterSignup: true,
		files: [],
	};
	const listName = process.env.SENDGRID_TEST_LIST!;

	it("adds a test lead to the SendGrid list", async () => {
		const res = await addToSendGrid(testLead, listName);
		expect([200, 201, 202]).toContain(res);
	});
});
