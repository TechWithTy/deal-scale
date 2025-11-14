import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@rsbuild/core", () => ({
	defineConfig: (config: unknown) => config,
}));

vi.mock("@rsbuild/plugin-react", () => ({
	__esModule: true,
	pluginReact: () => ({ name: "mock-rsbuild-react-plugin" }),
}));

describe("rsbuild preview config", () => {
	it("defines @ alias pointing to src directory", async () => {
		const configModule = await import(
			"../../tools/rspack-preview/rsbuild.config"
		);
		const config = (configModule.default ?? configModule) as {
			source?: { alias?: Record<string, string> };
		};

		expect(config.source?.alias?.["@"]).toBe(
			path.resolve(process.cwd(), "src"),
		);
	});
});

