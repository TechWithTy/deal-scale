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

let sendgridModule: typeof import("@/lib/externalRequests/sendgrid");
if (isExternalIntegrationEnabled) {
	sendgridModule = require("@/lib/externalRequests/sendgrid");
}

skipExternalTest("SendGrid REAL integration (sends real emails)");
describeIfExternal("SendGrid REAL integration (sends real emails)", () => {
	const sender = process.env.SENDGRID_SUPPORT_EMAIL;
	const recipient = process.env.SENDGRID_SALES_EMAIL;

	it("sends a real plain text email", async () => {
		const res = await sendgridModule!.sendMail(
			sender,
			recipient,
			"Integration Test Subject",
			"Integration Test Message (plain text)",
		);
		expect([200, 202]).toContain(res);
	});

	it("sends a real HTML email", async () => {
		const res = await sendgridModule!.sendMailHtml(
			sender,
			recipient,
			"Integration Test Subject (HTML)",
			"<b>Integration Test HTML Body</b>",
		);
		expect([200, 202]).toContain(res);
	});
});
