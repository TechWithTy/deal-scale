import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitIndexNow } from "../../deploy/submit-indexnow";

type FetchMock = ReturnType<typeof vi.fn<typeof fetch>>;

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

describe("submitIndexNow", () => {
	let fetchMock: FetchMock;
	let logSpy: ReturnType<typeof vi.spyOn<typeof console, "log">>;
	let warnSpy: ReturnType<typeof vi.spyOn<typeof console, "warn">>;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv };
		process.env.NODE_ENV = "development";
		process.env.INDEXNOW_SUBMIT_DISABLE = undefined;
		process.env.INDEXNOW_HOST = undefined;
		process.env.INDEXNOW_KEY = undefined;
		process.env.PRIVATE_INDEX_NOW_KEY = undefined;
		process.env.INDEXNOW_ENDPOINT = undefined;
		process.env.INDEXNOW_URLS = undefined;

		fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
			ok: true,
			status: 200,
			text: async () => "",
		} as Response) as FetchMock;
		global.fetch = fetchMock;
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		global.fetch = originalFetch;
		logSpy.mockRestore();
		warnSpy.mockRestore();
	});

	it("submits URLs successfully with default configuration", async () => {
		await submitIndexNow();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const call = fetchMock.mock.calls[0];
		expect(call[0]).toBe("https://www.bing.com/indexnow");
		expect(call[1]?.method).toBe("POST");
		expect(call[1]?.headers).toEqual({
			"Content-Type": "application/json; charset=utf-8",
		});

		const body = JSON.parse(call[1]?.body as string);
		expect(body.host).toBe("dealscale.io");
		expect(body.key).toBe("fccf3556b5fa455699db2554f79a235e");
		expect(body.urlList).toContain("https://dealscale.io/");
		expect(body.urlList).toContain("https://dealscale.io/rss.xml");
		expect(body.urlList).toContain("https://dealscale.io/rss/hybrid.xml");
		expect(body.urlList).toContain("https://dealscale.io/rss/youtube.xml");
		expect(body.urlList).toContain("https://dealscale.io/rss/github.xml");
		expect(body.urlList).toContain("https://dealscale.io/sitemap.xml");
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining("[indexnow] Submitting"),
		);
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining("[indexnow] Submission accepted"),
		);
	});

	it("uses custom host from INDEXNOW_HOST environment variable", async () => {
		process.env.INDEXNOW_HOST = "https://example.com";

		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(body.host).toBe("example.com");
		expect(body.urlList[0]).toBe("https://example.com/");
	});

	it("uses custom key from INDEXNOW_KEY environment variable", async () => {
		process.env.INDEXNOW_KEY = "custom-key-123";

		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(body.key).toBe("custom-key-123");
	});

	it("prefers PRIVATE_INDEX_NOW_KEY over INDEXNOW_KEY", async () => {
		process.env.INDEXNOW_KEY = "public-key";
		process.env.PRIVATE_INDEX_NOW_KEY = "private-key";

		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(body.key).toBe("private-key");
	});

	it("uses custom endpoint from INDEXNOW_ENDPOINT environment variable", async () => {
		process.env.INDEXNOW_ENDPOINT = "https://custom-endpoint.com/indexnow";

		await submitIndexNow();

		expect(fetchMock).toHaveBeenCalledWith(
			"https://custom-endpoint.com/indexnow",
			expect.any(Object),
		);
	});

	it("uses custom URLs from INDEXNOW_URLS environment variable", async () => {
		process.env.INDEXNOW_URLS = "/custom1,/custom2,/custom3";

		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(body.urlList).toContain("https://dealscale.io/custom1");
		expect(body.urlList).toContain("https://dealscale.io/custom2");
		expect(body.urlList).toContain("https://dealscale.io/custom3");
		expect(body.urlList).not.toContain("https://dealscale.io/rss.xml");
	});

	it("includes all RSS feeds in default URL list", async () => {
		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		const urlList = body.urlList as string[];

		expect(urlList).toContain("https://dealscale.io/rss.xml");
		expect(urlList).toContain("https://dealscale.io/rss/hybrid.xml");
		expect(urlList).toContain("https://dealscale.io/rss/youtube.xml");
		expect(urlList).toContain("https://dealscale.io/rss/github.xml");
	});

	it("skips submission when INDEXNOW_SUBMIT_DISABLE is set", async () => {
		process.env.INDEXNOW_SUBMIT_DISABLE = "1";

		await submitIndexNow();

		expect(fetchMock).not.toHaveBeenCalled();
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining("[indexnow] Submission disabled"),
		);
	});

	it("skips submission in test environment", async () => {
		process.env.NODE_ENV = "test";

		await submitIndexNow();

		expect(fetchMock).not.toHaveBeenCalled();
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				"[indexnow] Skipping submission in test environment",
			),
		);
	});

	it("throws error when submission fails with non-ok response", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 400,
			statusText: "Bad Request",
			text: async () => "Invalid key",
		} as Response);

		await expect(submitIndexNow()).rejects.toThrow(
			/\[indexnow\] Submission failed/,
		);
		expect(warnSpy).not.toHaveBeenCalled();
	});

	it("handles host without protocol correctly", async () => {
		process.env.INDEXNOW_HOST = "example.com";

		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(body.host).toBe("example.com");
		expect(body.urlList[0]).toBe("https://example.com/");
	});

	it("handles host with trailing slash correctly", async () => {
		process.env.INDEXNOW_HOST = "https://example.com/";

		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		expect(body.host).toBe("example.com");
		expect(body.urlList[0]).toBe("https://example.com/");
	});

	it("handles relative URLs correctly", async () => {
		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		const urlList = body.urlList as string[];

		// All URLs should be absolute
		for (const url of urlList) {
			expect(url).toMatch(/^https?:\/\//);
		}
	});

	it("handles fetch errors gracefully", async () => {
		fetchMock.mockRejectedValue(new Error("Network error"));

		await expect(submitIndexNow()).rejects.toThrow("Network error");
	});

	it("handles empty response text gracefully", async () => {
		fetchMock.mockResolvedValue({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
			text: async () => {
				throw new Error("Failed to read response");
			},
		} as Response);

		await expect(submitIndexNow()).rejects.toThrow(
			/\[indexnow\] Submission failed/,
		);
	});

	it("validates URL list contains expected default URLs", async () => {
		await submitIndexNow();

		const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
		const urlList = body.urlList as string[];

		// Check for key pages
		expect(urlList.length).toBeGreaterThanOrEqual(8);
		expect(urlList).toContain("https://dealscale.io/");
		expect(urlList).toContain("https://dealscale.io/portfolio");
		expect(urlList).toContain("https://dealscale.io/blogs");
		expect(urlList).toContain("https://dealscale.io/sitemap.xml");
	});
});
