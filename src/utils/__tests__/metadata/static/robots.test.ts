import robots from "@/app/robots";

describe("robots metadata", () => {
	it("defines explicit directives for strategic crawlers", () => {
		const config = robots();

		expect(config.host).toBe("https://dealscale.io");
		expect(config.sitemap).toEqual(
			expect.arrayContaining(["https://dealscale.io/sitemap.xml"]),
		);

		const targetedBots = [
			"*",
			"Googlebot",
			"GPTBot",
			"PerplexityBot",
			"ClaudeBot",
		];
		targetedBots.forEach((userAgent) => {
			const rule = config.rules.find((entry) => entry.userAgent === userAgent);
			expect(rule).toBeDefined();
			expect(Array.isArray(rule?.allow)).toBe(true);
			expect(rule?.allow).toEqual(
				expect.arrayContaining([
					"/",
					"/blogs",
					"/case-studies",
					"/events",
					"/partners",
				]),
			);
			expect(rule?.allow).not.toContain("/careers");
			expect(Array.isArray(rule?.disallow)).toBe(true);
			expect(rule?.disallow).toEqual(
				expect.arrayContaining([
					"/api/",
					"/admin/",
					"/drafts/",
					"/private/",
					"/sandbox/",
				]),
			);
		});
	});
});
