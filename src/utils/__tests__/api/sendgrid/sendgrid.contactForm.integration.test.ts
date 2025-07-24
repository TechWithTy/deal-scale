/**
 * @jest-environment node
 */
import "dotenv/config";
import { contactForm } from "@/lib/externalRequests/sendgrid";
import {
	SendGridAllField,
	SendGridBaseField,
	SendGridCustomField,
	allSendGridFields,
} from "@/types/sendgrid/sendgrid";

/**
 * REAL integration test for SendGrid contactForm functionality.
 * This will send an actual contact form email using your configured API key and sender.
 * Ensure you are using TEST keys and email addresses!
 */
console.log("STAGING_ENVIRONMENT:", process.env.STAGING_ENVIRONMENT);
console.log("SENDGRID_SUPPORT_EMAIL:", process.env.SENDGRID_SUPPORT_EMAIL);
console.log("SENDGRID_TEST_EMAIL:", process.env.SENDGRID_TEST_EMAIL);
console.log("SENDGRID_EMAIL:", process.env.SENDGRID_EMAIL);
console.log(
	"SENDGRID_TEST_API_KEY:",
	process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? "",
);
console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);

describe("SendGrid contactForm REAL integration (sends real email)", () => {
	const sender = process.env.SENDGRID_SUPPORT_EMAIL || "support@dealscale.io";
	const message = "Integration test message from contactForm.";
	const subject = "Contact Form Integration Test";
	const firstName = "Test";
	const lastName = "User";
	const referral = "IntegrationTest";

	it("sends a real contact form email", async () => {
		// contactForm expects sender as replyTo, recipient is CONTACT_EMAIL from env
		const res = await contactForm(
			sender,
			message,
			subject,
			firstName,
			lastName,
			referral,
		);
		expect([200, 202]).toContain(res);
	});
});
