import path from "node:path";
import { TextDecoder, TextEncoder } from "node:util";
import { describe, expect, it, vi } from "vitest";

if (typeof globalThis.TextEncoder === "undefined") {
	globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
	globalThis.TextDecoder =
		TextDecoder as unknown as typeof globalThis.TextDecoder;
}

vi.mock("@vitejs/plugin-react-swc", () => ({
	default: () => ({ name: "mock-react-swc" }),
}));
vi.mock("vite", () => ({
	defineConfig: (config: unknown) => config,
}));

describe("vite preview config", () => {
	it("maps @ alias to the src directory", async () => {
		const configModule = await import("../../tools/vite-preview/vite.config");
		const config = configModule.default ?? configModule;
		const aliases = Array.isArray(config.resolve?.alias)
			? config.resolve?.alias
			: [];

		expect(aliases).toContainEqual({
			find: "@",
			replacement: path.resolve(process.cwd(), "src"),
		});
	});
});
