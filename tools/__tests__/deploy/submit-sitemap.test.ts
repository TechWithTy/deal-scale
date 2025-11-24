import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitSitemaps } from "../../deploy/submit-sitemap.js";

type FetchMock = ReturnType<typeof vi.fn<typeof fetch>>;

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

describe("submitSitemaps", () => {
        let fetchMock: FetchMock;
        let logSpy: ReturnType<typeof vi.spyOn<typeof console, "log">>;
        let warnSpy: ReturnType<typeof vi.spyOn<typeof console, "warn">>;

        beforeEach(() => {
                vi.clearAllMocks();
                process.env = { ...originalEnv };
                process.env.NODE_ENV = "development";
                process.env.SITEMAP_CANONICAL_BASE = "https://example.com";
                process.env.SITEMAP_PATHS = "sitemap.xml";
                fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
                        ok: true,
                        status: 200,
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

        it("submits all sitemaps when global fetch is available", async () => {
                const failures = await submitSitemaps();

                expect(failures).toBe(0);
                expect(fetchMock).toHaveBeenCalledTimes(2);
                expect(fetchMock).toHaveBeenCalledWith(
                        "https://www.google.com/ping?sitemap=https%3A%2F%2Fexample.com%2Fsitemap.xml",
                        { method: "GET" },
                );
        });

        it("reports failures for non-ok responses", async () => {
                fetchMock.mockResolvedValue({ ok: false, status: 500 } as Response);

                const failures = await submitSitemaps();

                expect(failures).toBe(2);
                expect(warnSpy).toHaveBeenCalled();
        });

        it("throws when no global fetch implementation exists", async () => {
                // @ts-expect-error Allow clearing fetch for the test environment.
                global.fetch = undefined;

                await expect(submitSitemaps()).rejects.toThrow("Global fetch implementation is unavailable");
        });

        it("skips submission when disabled via environment flag", async () => {
                process.env.SITEMAP_SUBMIT_DISABLE = "1";

                const failures = await submitSitemaps();

                expect(failures).toBe(0);
                expect(fetchMock).not.toHaveBeenCalled();
        });
});
