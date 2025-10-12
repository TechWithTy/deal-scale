/**
 * @jest-environment node
 */
import "dotenv/config";
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
	"SENDGRID_TEST_API_KEY:",
	process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? "",
);
console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);

let contactFormImpl: typeof import(
	"@/lib/externalRequests/sendgrid",
).contactForm;
if (isExternalIntegrationEnabled) {
	({
		contactForm: contactFormImpl,
	} = require("@/lib/externalRequests/sendgrid"));
}

skipExternalTest("SendGrid contactForm REAL integration (sends real email)");
describeIfExternal(
	"SendGrid contactForm REAL integration (sends real email)",
	() => {
		const sender = process.env.SENDGRID_SUPPORT_EMAIL || "support@dealscale.io";
		const message = "Integration test message from contactForm.";
		const subject = "Contact Form Integration Test";
		const firstName = "Test";
		const lastName = "User";
		const referral = "IntegrationTest";

		it("sends a real contact form email", async () => {
			const res = await contactFormImpl!(
				sender,
				message,
				subject,
				firstName,
				lastName,
				referral,
			);
			expect([200, 202]).toContain(res);
		});
	},
);
