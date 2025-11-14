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
console.log("SENDGRID_TEST_EMAIL:", process.env.SENDGRID_TEST_EMAIL);
console.log("SENDGRID_EMAIL:", process.env.SENDGRID_EMAIL);
console.log(
	`SENDGRID_TEST_API_KEY: ${process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? ""}...`,
);
console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);

type AddToSendGridFn = typeof import("@/lib/externalRequests/sendgrid");
["addToSendGrid"];

let addToSendGridImpl: AddToSendGridFn | undefined;
if (isExternalIntegrationEnabled) {
	({
		addToSendGrid: addToSendGridImpl,
	} = require("@/lib/externalRequests/sendgrid"));
}

skipExternalTest("SendGrid addToSendGrid REAL integration (adds lead to list)");
describeIfExternal(
	"SendGrid addToSendGrid REAL integration (adds lead to list)",
	() => {
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
			const res = await addToSendGridImpl!(testLead, listName);
			expect([200, 201, 202]).toContain(res);
		});
	},
);
