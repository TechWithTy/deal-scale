import { GET } from "@/app/api/auth/oauth/credentials/route";
import { NextResponse } from "next/server";
/**
 * @jest-environment node
 */
import fetch, {
	Request as NodeFetchRequest,
	Response as NodeFetchResponse,
} from "node-fetch";
import {
	createSession,
	mockFetchResponse,
	resetMocks,
} from "../../../testHelpers/auth";

const globalAny = global as typeof globalThis & Record<string, unknown>;

if (!globalAny.Request) {
	globalAny.Request = NodeFetchRequest;
}

if (!globalAny.Response) {
	globalAny.Response = NodeFetchResponse;
}

if (!globalAny.fetch) {
	globalAny.fetch = fetch;
}

jest.mock("next-auth", () => ({
	getServerSession: jest.fn(),
}));

describe("GET /api/auth/oauth/credentials", () => {
	const getServerSession = jest.requireMock("next-auth")
		.getServerSession as jest.Mock;

	beforeAll(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		resetMocks();
		getServerSession.mockReset();
	});

	it("returns 401 when no session is present", async () => {
		getServerSession.mockResolvedValueOnce(null);

		const response = await GET();
		const json = await response.json();

		expect(response.status).toBe(401);
		expect(json).toEqual({ error: "Unauthorized" });
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("returns data from DealScale when available", async () => {
		const session = createSession();
		const payload = { providers: [{ provider: "LINKEDIN", connected: true }] };

		getServerSession.mockResolvedValueOnce(session);
		mockFetchResponse({ status: 200, json: payload });

		const response = await GET();
		const json = await response.json();

		expect(response.status).toBe(200);
		expect(json).toEqual(payload);
		expect(global.fetch).toHaveBeenCalledWith(
			"https://api.dealscale.io/api/v1/auth/oauth/credentials",
			expect.objectContaining({
				method: "GET",
				headers: expect.objectContaining({
					Authorization: `Bearer ${session.dsTokens?.access_token}`,
					"Content-Type": "application/json",
				}),
			}),
		);
	});

	it("propagates backend failure as 500", async () => {
		const session = createSession();
		getServerSession.mockResolvedValueOnce(session);
		mockFetchResponse({ status: 500, text: "Internal error" });

		const response = await GET();
		const json = await response.json();

		expect(response.status).toBe(500);
		expect(json).toEqual({ error: "Failed to get OAuth credentials" });
	});

	it("handles unexpected exceptions with 500", async () => {
		const session = createSession();
		getServerSession.mockResolvedValueOnce(session);
		(global.fetch as jest.Mock).mockRejectedValueOnce(
			new Error("network down"),
		);

		const response = await GET();
		const json = await response.json();

		expect(response.status).toBe(500);
		expect(json).toEqual({ error: "Internal server error" });
	});
});
