import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("lottie-react", () => ({
	__esModule: true,
	default: () => null,
}));

describe("exportLandingData", () => {
	let tempRoot: string;
	type ExportLandingData = typeof import(
		"../../../../tools/strapi/export-landing",
	)["exportLandingData"];
	let exportLandingData: ExportLandingData;

	beforeAll(async () => {
		({ exportLandingData } = await import(
			"../../../../tools/strapi/export-landing"
		));
		tempRoot = await mkdtemp(path.join(os.tmpdir(), "landing-export-"));
	});

	afterAll(async () => {
		await rm(tempRoot, { recursive: true, force: true });
	});

	it("writes the landing JSON payloads to disk", async () => {
		const tempDir = await mkdtemp(path.join(tempRoot, "all-"));
		const summary = await exportLandingData({ outDir: tempDir, silent: true });

		expect(summary.files).toEqual(
			expect.arrayContaining([path.join(tempDir, "landing-hero.json")]),
		);

		const heroRaw = await readFile(
			path.join(tempDir, "landing-hero.json"),
			"utf8",
		);
		const hero = JSON.parse(heroRaw) as { headline: string };
		expect(hero.headline).toBe("Tired of Chasing ");

		const servicesRaw = await readFile(
			path.join(tempDir, "services.json"),
			"utf8",
		);
		const services = JSON.parse(servicesRaw) as Record<string, unknown>;
		expect(Object.keys(services)).not.toHaveLength(0);
	});

	it("filters exports when entities are provided", async () => {
		const tempDir = await mkdtemp(path.join(tempRoot, "filtered-"));
		const summary = await exportLandingData({
			outDir: tempDir,
			silent: true,
			entities: ["pricing-plans"],
		});

		expect(summary.files).toEqual([path.join(tempDir, "pricing-plans.json")]);

		const pricingRaw = await readFile(
			path.join(tempDir, "pricing-plans.json"),
			"utf8",
		);
		const pricing = JSON.parse(pricingRaw);
		expect(Array.isArray(pricing)).toBe(true);
		expect(pricing.length).toBeGreaterThan(0);
	});
});
