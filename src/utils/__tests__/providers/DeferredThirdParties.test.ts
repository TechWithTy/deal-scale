describe("DeferredThirdParties module", () => {
	it("exposes a default export that can be dynamically imported", async () => {
		const mod = await import("@/components/providers/DeferredThirdParties");
		expect(typeof mod.default).toBe("function");
	});
});
