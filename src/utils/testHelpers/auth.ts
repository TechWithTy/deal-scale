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

type FetchMock = ((
	...args: Parameters<typeof fetch>
) => ReturnType<typeof fetch>) & {
	mockResolvedValueOnce: (value: unknown) => unknown;
	mockRejectedValueOnce: (error: unknown) => unknown;
	mockReset: () => unknown;
};

function getFetchMock() {
	return global.fetch as unknown as FetchMock;
}

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

	// Create a proper mock response with minimal required properties
	const mockResponse = {
		ok: status >= 200 && status < 300,
		status,
		headers: {
			get: (key: string) => headers[key.toLowerCase()] ?? null,
		},
		json: async () => bodyJson,
		text: async () => bodyText,
		// Add other required Response properties as no-ops or undefined
		arrayBuffer: async () => new ArrayBuffer(0),
		blob: async () => new Blob(),
		clone: () => mockResponse,
		body: null,
		bodyUsed: false,
		formData: async () => new FormData(),
		type: "basic" as const,
		url: "",
		redirected: false,
	};

	getFetchMock().mockResolvedValueOnce(mockResponse as Response);
}

/**
 * Sets the global fetch mock to reject with an error.
 */
export function mockFetchReject(error: Error) {
	getFetchMock().mockRejectedValueOnce(error);
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
	getFetchMock().mockReset();
}
