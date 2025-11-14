import { defineConfig } from "vitest/config";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: [
			"**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}",
			"**/?(*.)+(spec|test).{js,jsx,ts,tsx}",
			"**/*.__tests__.{js,jsx,ts,tsx}",
		],
		testTimeout: 30000,
		coverage: {
			provider: "v8",
		},
	},
	resolve: {
		alias: [
			{ find: "@", replacement: path.resolve(__dirname, "./src") },
			{
				find: "@external/dynamic-hero",
				replacement: path.resolve(
					__dirname,
					"./src/components/dynamic-hero/src",
				),
			},
			{
				find: /^@external\/dynamic-hero\/(.*)$/,
				replacement: path.resolve(
					__dirname,
					"./src/components/dynamic-hero/src/$1",
				),
			},
			{
				find: "@external/use-exit-intent",
				replacement: path.resolve(
					__dirname,
					"./external/use-exit-intent-remastered/packages/use-exit-intent/src",
				),
			},
			{
				find: /^@external\/use-exit-intent\/(.*)$/,
				replacement: path.resolve(
					__dirname,
					"./external/use-exit-intent-remastered/packages/use-exit-intent/src/$1",
				),
			},
			{
				find: "server-only",
				replacement: path.resolve(__dirname, "./tests/stubs/server-only.ts"),
			},
			{
				find: "@plausible-analytics/tracker",
				replacement: path.resolve(__dirname, "./tests/stubs/plausible.ts"),
			},
			{
				find: "posthog-js",
				replacement: path.resolve(__dirname, "./tests/stubs/posthog.ts"),
			},
			{
				find: "@posthog/js-lite",
				replacement: path.resolve(__dirname, "./tests/stubs/posthog.ts"),
			},
		],
	},
});

