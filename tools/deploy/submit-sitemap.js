const DEFAULT_CANONICAL = "https://dealscale.io";

/**
 * Resolve the canonical base URL for sitemap submissions.
 * @returns {string}
 */
function resolveCanonicalBase() {
        const fromEnv = process.env.SITEMAP_CANONICAL_BASE?.trim();
        if (fromEnv) {
                return fromEnv.replace(/\/$/, "");
        }
        return DEFAULT_CANONICAL;
}

/**
 * Build fully qualified sitemap URLs.
 * @param {string} base
 * @returns {string[]}
 */
function resolveSitemapUrls(base) {
        const raw = process.env.SITEMAP_PATHS?.split(",")
                .map((entry) => entry.trim())
                .filter(Boolean);
        const paths = raw && raw.length > 0 ? raw : ["sitemap.xml"];
        return paths.map((path) => {
                if (/^https?:\/\//i.test(path)) {
                        return path;
                }
                const normalized = path.replace(/^\//, "");
                return `${base}/${normalized}`;
        });
}

const SEARCH_ENGINES = [
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

function resolveFetch() {
        if (typeof globalThis.fetch === "function") {
                return globalThis.fetch.bind(globalThis);
        }

        throw new Error(
                "[sitemap] Global fetch implementation is unavailable. Provide a polyfill before running submissions.",
        );
}

async function submitSitemaps() {
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

        const fetchFn = resolveFetch();

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

async function run() {
        try {
                const failures = await submitSitemaps();
                if (failures > 0) {
                        process.exitCode = 0;
                }
        } catch (error) {
                console.warn("[sitemap] Unexpected error during submission:", error);
                process.exitCode = 0;
        }
}

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
        void run();
}

module.exports = {
        DEFAULT_CANONICAL,
        resolveCanonicalBase,
        resolveSitemapUrls,
        submitSitemaps,
        run,
};
