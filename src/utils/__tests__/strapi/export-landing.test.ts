import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

jest.mock("lottie-react", () => ({
        __esModule: true,
        default: () => null,
}));

describe("exportLandingData", () => {
        let tempDir: string;
        let exportLandingData: typeof import("../../../../tools/strapi/export-landing")["exportLandingData"];

        beforeAll(async () => {
                ({ exportLandingData } = await import("../../../../tools/strapi/export-landing"));
                tempDir = await mkdtemp(path.join(os.tmpdir(), "landing-export-"));
        });

        afterAll(async () => {
                await rm(tempDir, { recursive: true, force: true });
        });

        it("writes the landing JSON payloads to disk", async () => {
                const summary = await exportLandingData({ outDir: tempDir, silent: true });

                expect(summary.files).toEqual(
                        expect.arrayContaining([path.join(tempDir, "landing-hero.json")]),
                );

                const heroRaw = await readFile(path.join(tempDir, "landing-hero.json"), "utf8");
                const hero = JSON.parse(heroRaw) as { headline: string };
                expect(hero.headline).toBe("Tired of Chasing ");

                const servicesRaw = await readFile(path.join(tempDir, "services.json"), "utf8");
                const services = JSON.parse(servicesRaw) as Record<string, unknown>;
                expect(Object.keys(services)).not.toHaveLength(0);
        });
});
