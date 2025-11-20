import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const sendMailMock = vi.fn().mockResolvedValue(202);
const sendMailHtmlMock = vi.fn().mockResolvedValue(202);

vi.mock("@/lib/externalRequests/sendgrid", () => ({
	sendMail: sendMailMock,
	sendMailHtml: sendMailHtmlMock,
}));

const setApiKeyMock = vi.fn();
const sendMock = vi.fn().mockResolvedValue([{ statusCode: 202 }]);

vi.mock("@sendgrid/mail", () => ({
	default: {
		setApiKey: setApiKeyMock,
		send: sendMock,
	},
	setApiKey: setApiKeyMock,
	send: sendMock,
}));

let sendgrid: typeof import("@/lib/externalRequests/sendgrid");

beforeAll(async () => {
	sendgrid = await import("@/lib/externalRequests/sendgrid");
});

describe("SendGrid integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sends a plain text email", async () => {
		const res = await sendgrid.sendMail(
			"sender@test.com",
			"to@test.com",
			"Test Subject",
			"Test Message",
		);
		expect(res).toBe(202);
		expect(sendMailMock).toHaveBeenCalledWith(
			"sender@test.com",
			"to@test.com",
			"Test Subject",
			"Test Message",
		);
	});

	it("sends an HTML email", async () => {
		const res = await sendgrid.sendMailHtml(
			"sender@test.com",
			"to@test.com",
			"Test Subject",
			"<b>Test</b>",
		);
		expect(res).toBe(202);
		expect(sendMailHtmlMock).toHaveBeenCalledWith(
			"sender@test.com",
			"to@test.com",
			"Test Subject",
			"<b>Test</b>",
		);
	});
});
