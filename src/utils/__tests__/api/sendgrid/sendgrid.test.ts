import * as sendgrid from "@/lib/externalRequests/sendgrid";
import sgMail from "@sendgrid/mail";

jest.mock("@sendgrid/mail", () => ({
	setApiKey: jest.fn(),
	send: jest.fn().mockResolvedValue([{ statusCode: 202 }]),
}));

/**
 * Tests for SendGrid email sending functions.
 * All network calls are mocked. No real emails are sent.
 */
describe("SendGrid integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("sends a plain text email", async () => {
		const res = await sendgrid.sendMail(
			"sender@test.com",
			"to@test.com",
			"Test Subject",
			"Test Message",
		);
		expect(res).toBe(202);
	});

	it("sends an HTML email", async () => {
		const res = await sendgrid.sendMailHtml(
			"sender@test.com",
			"to@test.com",
			"Test Subject",
			"<b>Test</b>",
		);
		expect(res).toBe(202);
	});
});
