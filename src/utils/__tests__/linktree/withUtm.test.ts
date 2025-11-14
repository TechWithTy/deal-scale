/**
 * Tests for withUtm utility function
 */

import { withUtm } from "@/utils/linktree-redis";

describe("withUtm", () => {
	const slug = "test-slug";

	beforeEach(() => {
		// Set a predictable value for the source host
		process.env.NEXT_PUBLIC_SITE_HOST = "dealscale.ai";
	});

	afterEach(() => {
		delete process.env.NEXT_PUBLIC_SITE_HOST;
	});

	describe("removes existing UTM parameters when notionUtms is provided", () => {
		test("removes single existing UTM parameter", () => {
			const url = "https://example.com/target?utm_source=old";
			const notionUtms = {
				utm_source: "notion-source",
				utm_campaign: "notion-campaign",
			};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("notion-source");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(
				"notion-campaign",
			);
			// Ensure "old" value is not present
			expect(result).not.toContain("utm_source=old");
		});

		test("removes multiple existing UTM parameters", () => {
			const url =
				"https://example.com/target?utm_source=old&utm_campaign=old&utm_medium=old";
			const notionUtms = {
				utm_source: "notion-source",
				utm_campaign: "notion-campaign",
			};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("notion-source");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(
				"notion-campaign",
			);
			expect(resultUrl.searchParams.get("utm_medium")).toBeNull();
			expect(result).not.toContain("utm_source=old");
			expect(result).not.toContain("utm_campaign=old");
			expect(result).not.toContain("utm_medium=old");
		});

		test("removes all UTM parameters including those not replaced", () => {
			const url =
				"https://example.com/target?utm_source=old&utm_medium=old&utm_content=old&utm_term=old";
			const notionUtms = {
				utm_source: "notion-source",
			};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("notion-source");
			// All other UTM params should be removed
			expect(resultUrl.searchParams.get("utm_medium")).toBeNull();
			expect(resultUrl.searchParams.get("utm_content")).toBeNull();
			expect(resultUrl.searchParams.get("utm_term")).toBeNull();
		});

		test("preserves non-UTM query parameters", () => {
			const url =
				"https://example.com/target?utm_source=old&param1=value1&param2=value2";
			const notionUtms = {
				utm_source: "notion-source",
			};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("notion-source");
			expect(resultUrl.searchParams.get("param1")).toBe("value1");
			expect(resultUrl.searchParams.get("param2")).toBe("value2");
		});
	});

	describe("adds all Notion UTM parameters", () => {
		test("adds all provided Notion UTM parameters", () => {
			const url = "https://example.com/target";
			const notionUtms = {
				utm_source: "notion-source",
				utm_campaign: "notion-campaign",
				utm_medium: "notion-medium",
				utm_content: "notion-content",
				utm_term: "notion-term",
				utm_offer: "notion-offer",
			};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("notion-source");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(
				"notion-campaign",
			);
			expect(resultUrl.searchParams.get("utm_medium")).toBe("notion-medium");
			expect(resultUrl.searchParams.get("utm_content")).toBe("notion-content");
			expect(resultUrl.searchParams.get("utm_term")).toBe("notion-term");
			expect(resultUrl.searchParams.get("utm_offer")).toBe("notion-offer");
		});

		test("adds partial Notion UTM parameters", () => {
			const url = "https://example.com/target";
			const notionUtms = {
				utm_source: "notion-source",
				utm_campaign: "notion-campaign",
			};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("notion-source");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(
				"notion-campaign",
			);
			expect(resultUrl.searchParams.get("utm_medium")).toBeNull();
		});
	});

	describe("uses default UTM parameters when notionUtms is not provided", () => {
		test("adds default utm_source and utm_campaign", () => {
			const url = "https://example.com/target";

			const result = withUtm(url, slug);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("dealscale.ai");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(slug);
		});

		test("preserves existing UTM parameters when notionUtms is not provided", () => {
			const url =
				"https://example.com/target?utm_source=existing&utm_campaign=existing";

			const result = withUtm(url, slug);
			const resultUrl = new URL(result);

			// Should keep existing values
			expect(resultUrl.searchParams.get("utm_source")).toBe("existing");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe("existing");
		});

		test("adds default only for missing UTM parameters", () => {
			const url = "https://example.com/target?utm_source=existing";

			const result = withUtm(url, slug);
			const resultUrl = new URL(result);

			expect(resultUrl.searchParams.get("utm_source")).toBe("existing");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(slug);
		});
	});

	describe("handles special cases", () => {
		test("returns internal path unchanged", () => {
			const url = "/internal/path";

			const result = withUtm(url, slug);

			expect(result).toBe(url);
		});

		test("skips S3 URLs", () => {
			const url = "https://mybucket.s3.amazonaws.com/file.jpg";

			const result = withUtm(url, slug);

			expect(result).toBe(url);
		});

		test("skips URLs with X-Amz signature parameters", () => {
			const url =
				"https://example.com/file?X-Amz-Signature=abc123&X-Amz-Algorithm=AWS4-HMAC-SHA256";

			const result = withUtm(url, slug);

			expect(result).toBe(url);
		});

		test("returns original URL on parse error", () => {
			const url = "not a valid url";

			const result = withUtm(url, slug);

			expect(result).toBe(url);
		});
	});

	describe("edge cases with empty notionUtms object", () => {
		test("removes existing UTM params and adds defaults when notionUtms is empty object", () => {
			const url = "https://example.com/target?utm_source=old&utm_campaign=old";
			const notionUtms = {};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			// Old UTM params should be removed and defaults added
			expect(resultUrl.searchParams.get("utm_source")).toBe("dealscale.ai");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(slug);
			expect(result).not.toContain("utm_source=old");
			expect(result).not.toContain("utm_campaign=old");
		});

		test("handles URL with mixed old and new params when notionUtms is empty object", () => {
			const url = "https://example.com/target?utm_source=old&other=value";
			const notionUtms = {};

			const result = withUtm(url, slug, notionUtms);
			const resultUrl = new URL(result);

			// Old param removed, defaults should be added, other param preserved
			expect(resultUrl.searchParams.get("utm_source")).toBe("dealscale.ai");
			expect(resultUrl.searchParams.get("utm_campaign")).toBe(slug);
			expect(resultUrl.searchParams.get("other")).toBe("value");
			expect(result).not.toContain("utm_source=old");
		});
	});
});
