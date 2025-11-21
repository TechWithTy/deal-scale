import { NextRequest } from "next/server";
/**
 * @jest-environment node
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/externalRequests/sendgrid", () => ({
	addToSendGrid: vi.fn(),
}));

let POST: typeof import("@/app/api/contact/route").POST;
let mockedAddToSendGrid: ReturnType<typeof vi.fn>;

beforeAll(async () => {
	({ POST } = await import("@/app/api/contact/route"));
	const sendgridModule = await import("@/lib/externalRequests/sendgrid");
	mockedAddToSendGrid = sendgridModule.addToSendGrid as ReturnType<
		typeof vi.fn
	>;
});

describe("POST /api/contact (E2E)", () => {
	beforeEach(() => {
		mockedAddToSendGrid.mockReset();
	});

	it("should successfully process a beta tester submission", async () => {
		// Arrange: Mock a successful SendGrid response
		mockedAddToSendGrid.mockResolvedValue(202);

		const betaTesterData = {
			email: "beta.tester@example.com",
			firstName: "Beta",
			lastName: "Tester",
			zipCode: "12345",
			companyName: "Beta Inc.",
			beta_tester: true,
		};

		const request = new NextRequest("http://localhost/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(betaTesterData),
		});

		// Act
		const response = await POST(request);
		const responseBody = await response.json();

		// Assert
		expect(response.status).toBe(200);
		expect(responseBody.message).toBe(
			"Contact added to SendGrid successfully.",
		);
		expect(mockedAddToSendGrid).toHaveBeenCalledTimes(1);
		expect(mockedAddToSendGrid).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "beta.tester@example.com",
				beta_tester: true,
				pilot_member: false, // Ensure pilot_member is not true
			}),
			"Deal Scale",
		);
	});

	it("should successfully process a pilot member submission", async () => {
		// Arrange: Mock a successful SendGrid response
		mockedAddToSendGrid.mockResolvedValue(202);

		const pilotMemberData = {
			email: "pilot.member@example.com",
			firstName: "Pilot",
			lastName: "Member",
			zipCode: "54321",
			companyName: "Pilot Corp.",
			pilot_member: true,
		};

		const request = new NextRequest("http://localhost/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(pilotMemberData),
		});

		// Act
		const response = await POST(request);
		const responseBody = await response.json();

		// Assert
		expect(response.status).toBe(200);
		expect(responseBody.message).toBe(
			"Contact added to SendGrid successfully.",
		);
		expect(mockedAddToSendGrid).toHaveBeenCalledTimes(1);
		expect(mockedAddToSendGrid).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "pilot.member@example.com",
				pilot_member: true,
				beta_tester: false, // Ensure beta_tester is not true
			}),
			"Deal Scale",
		);
	});

	it("should return a 400 error if email is missing", async () => {
		// Arrange
		const invalidData = { firstName: "No", lastName: "Email" };
		const request = new NextRequest("http://localhost/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(invalidData),
		});

		// Act
		const response = await POST(request);
		const responseBody = await response.json();

		// Assert
		expect(response.status).toBe(400);
		expect(responseBody.error).toBe("Email is a required field.");
		expect(mockedAddToSendGrid).not.toHaveBeenCalled();
	});

	it("should return a 500 error if SendGrid fails", async () => {
		// Arrange: Mock a failed SendGrid response
		mockedAddToSendGrid.mockResolvedValue(500);

		const data = { email: "fail@example.com", beta_tester: true };
		const request = new NextRequest("http://localhost/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		// Act
		const response = await POST(request);
		const responseBody = await response.json();

		// Assert
		expect(response.status).toBe(500);
		expect(responseBody.error).toBe("Failed to add contact to SendGrid.");
		expect(mockedAddToSendGrid).toHaveBeenCalledTimes(1);
	});
});
