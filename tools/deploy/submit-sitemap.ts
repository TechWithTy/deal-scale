const DEFAULT_CANONICAL = "https://dealscale.io";

function resolveCanonicalBase(): string {
        const fromEnv = process.env.SITEMAP_CANONICAL_BASE?.trim();
        if (fromEnv) {
                return fromEnv.replace(/\/$/, "");
        }
        return DEFAULT_CANONICAL;
}

function resolveSitemapUrls(base: string): string[] {
        const raw = process.env.SITEMAP_PATHS?.split(",").map((entry) => entry.trim()).filter(Boolean);
        const paths = raw && raw.length > 0 ? raw : ["sitemap.xml"];
        return paths.map((path) => {
                if (/^https?:\/\//i.test(path)) {
                        return path;
                }
                const normalized = path.replace(/^\//, "");
                return `${base}/${normalized}`;
        });
}

type Engine = {
        name: string;
        buildPingUrl: (sitemapUrl: string) => string;
};

const SEARCH_ENGINES: Engine[] = [
        {
                name: "google",
                buildPingUrl: (sitemapUrl) =>
                        `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        },
        {
                name: "bing",
                buildPingUrl: (sitemapUrl) =>
                        `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        },
];

async function submitSitemaps(): Promise<number> {
        if (process.env.SITEMAP_SUBMIT_DISABLE === "1") {
                console.log("[sitemap] Submission disabled via SITEMAP_SUBMIT_DISABLE.");
                return 0;
        }

        if (process.env.NODE_ENV === "test") {
                console.log("[sitemap] Skipping submission in test environment.");
                return 0;
        }

        const canonicalBase = resolveCanonicalBase();
        const sitemapUrls = resolveSitemapUrls(canonicalBase);
        console.log(`[sitemap] Submitting ${sitemapUrls.length} sitemap(s) for ${canonicalBase}.`);

        const fetchFn = typeof fetch === "function"
                ? fetch
                : (await import("node-fetch")).default as typeof fetch;

        let failureCount = 0;
        for (const sitemapUrl of sitemapUrls) {
                for (const engine of SEARCH_ENGINES) {
                        const endpoint = engine.buildPingUrl(sitemapUrl);
                        try {
                                const response = await fetchFn(endpoint, { method: "GET" });
                                if (response.ok) {
                                        console.log(
                                                `[sitemap] ${engine.name} accepted submission for ${sitemapUrl} (status ${response.status}).`,
                                        );
                                } else {
                                        failureCount += 1;
                                        console.warn(
                                                `[sitemap] ${engine.name} responded with status ${response.status} for ${sitemapUrl}.`,
                                        );
                                }
                        } catch (error) {
                                failureCount += 1;
                                console.warn(
                                        `[sitemap] Failed to submit ${sitemapUrl} to ${engine.name}:`,
                                        error,
                                );
                        }
                }
        }

        if (failureCount > 0) {
                console.warn(`[sitemap] Completed with ${failureCount} submission warning(s).`);
        } else {
                console.log("[sitemap] Completed all submissions successfully.");
        }

        return failureCount;
}

(async () => {
        try {
                const failures = await submitSitemaps();
                if (failures > 0) {
                        process.exitCode = 0; // Log warnings without failing build
                }
        } catch (error) {
                console.warn("[sitemap] Unexpected error during submission:", error);
                process.exitCode = 0;
        }
})();
