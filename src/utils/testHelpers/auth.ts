import { NextRequest } from "next/server";

type Session = {
	user?: { id?: string; email?: string };
	dsTokens?: { access_token?: string; refresh_token?: string };
};

type MockFetchResponseOptions = {
	status?: number;
	json?: unknown;
	text?: string;
	headers?: Record<string, string>;
};

/**
 * Creates a mock session object with DealScale tokens.
 */
export function createSession(overrides: Partial<Session> = {}): Session {
	return {
		user: { id: "user-123", email: "user@example.com" },
		dsTokens: { access_token: "access-token", refresh_token: "refresh-token" },
		...overrides,
	};
}

/**
 * Sets the global fetch mock to return a resolved response with the provided payload.
 */
export function mockFetchResponse({
	status = 200,
	json,
	text,
	headers = {},
}: MockFetchResponseOptions) {
	const bodyJson = json;
	const bodyText = text ?? (json ? JSON.stringify(json) : "");
	(global.fetch as jest.Mock).mockResolvedValueOnce({
		ok: status >= 200 && status < 300,
		status,
		headers: {
			get: (key: string) => headers[key.toLowerCase()] ?? null,
		},
		json: async () => bodyJson,
		text: async () => bodyText,
	} satisfies Response);
}

/**
 * Sets the global fetch mock to reject with an error.
 */
export function mockFetchReject(error: Error) {
	(global.fetch as jest.Mock).mockRejectedValueOnce(error);
}

/**
 * Creates a simple `NextRequest` for testing route handlers.
 */
export function createRequest(url: string, init?: RequestInit) {
	return new NextRequest(new Request(url, init));
}

/**
 * Resets shared mocks between tests.
 */
export function resetMocks() {
	(global.fetch as jest.Mock).mockReset();
}
