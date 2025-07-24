/**
 * @jest-environment node
 */
import "dotenv/config";
console.log("STAGING_ENVIRONMENT:", process.env.STAGING_ENVIRONMENT);
console.log("SENDGRID_SUPPORT_EMAIL:", process.env.SENDGRID_SUPPORT_EMAIL);
console.log("SENDGRID_TEST_EMAIL:", process.env.SENDGRID_TEST_EMAIL);
console.log("SENDGRID_EMAIL:", process.env.SENDGRID_EMAIL);
console.log(
	"SENDGRID_TEST_API_KEY:",
	process.env.SENDGRID_TEST_API_KEY?.slice(0, 10) ?? "",
);
console.log("CONTACT_EMAIL:", process.env.CONTACT_EMAIL);

import * as sendgrid from "@/lib/externalRequests/sendgrid";
import {
	SendGridAllField,
	SendGridBaseField,
	SendGridCustomField,
	allSendGridFields,
} from "@/types/sendgrid/sendgrid";

/**
 * REAL integration test for SendGrid email sending functions.
 * This will send actual emails using your configured API key and list.
 * Ensure you are using TEST keys and email addresses!
 */
describe("SendGrid REAL integration (sends real emails)", () => {
	const sender = process.env.SENDGRID_SUPPORT_EMAIL;
	const recipient = process.env.SENDGRID_SALES_EMAIL;

	it("sends a real plain text email", async () => {
		const res = await sendgrid.sendMail(
			sender,
			recipient,
			"Integration Test Subject",
			"Integration Test Message (plain text)",
		);
		expect([200, 202]).toContain(res);
	});

	it("sends a real HTML email", async () => {
		const res = await sendgrid.sendMailHtml(
			sender,
			recipient,
			"Integration Test Subject (HTML)",
			"<b>Integration Test HTML Body</b>",
		);
		expect([200, 202]).toContain(res);
	});
});
