import path from "node:path";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const projectRoot = path.resolve(__dirname, "../../");
const srcDir = path.resolve(projectRoot, "src");
const dynamicHeroSrc = path.resolve(
	projectRoot,
	"src/components/dynamic-hero/src",
);
const shimDir = path.resolve(__dirname, "../vite-preview/src/shims");

export default defineConfig({
	root: __dirname,
	plugins: [pluginReact()],
	source: {
		entry: {
			main: "./src/main.tsx",
		},
		alias: {
			"@": srcDir,
			"@external/dynamic-hero": dynamicHeroSrc,
			"@external/dynamic-hero/*": `${dynamicHeroSrc}/*`,
			"next/image": path.resolve(shimDir, "next-image.tsx"),
			"next/link": path.resolve(shimDir, "next-link.tsx"),
			"server-only": path.resolve(shimDir, "server-only.ts"),
		},
	},
	html: {
		template: "./index.html",
		title: "DealScale Rspack Preview",
	},
	dev: {},
	server: {
		port: 5175,
		open: true,
	},
	output: {
		distPath: {
			root: path.resolve(projectRoot, "dist/rspack-preview"),
		},
	},
	tools: {
		postcss: (opts) => {
			const resolvedConfigPath = path.resolve(projectRoot, "postcss.config.js");

			type NormalizedPostcssOptions = Record<string, unknown> & {
				config?: Record<string, unknown>;
			};

			const normalizePostcssOptions = (
				options: unknown,
			): NormalizedPostcssOptions => {
				const base =
					typeof options === "object" && options !== null
						? (options as Record<string, unknown>)
						: {};
				const existingConfig =
					typeof base.config === "object" && base.config !== null
						? { ...(base.config as Record<string, unknown>) }
						: {};

				base.config = {
					...existingConfig,
					path: resolvedConfigPath,
				};

				return base as NormalizedPostcssOptions;
			};

			if (typeof opts.postcssOptions === "function") {
				const originalFactory = opts.postcssOptions;
				opts.postcssOptions = ((loaderContext) => {
					const originalOptions = originalFactory(loaderContext);
					if (
						originalOptions &&
						typeof (originalOptions as PromiseLike<unknown>).then === "function"
					) {
						return (originalOptions as PromiseLike<unknown>).then(
							(result) => normalizePostcssOptions(result) as unknown,
						);
					}

					return normalizePostcssOptions(originalOptions) as unknown;
				}) as typeof originalFactory;
				return;
			}

			const normalized = normalizePostcssOptions(opts.postcssOptions);
			opts.postcssOptions = normalized as unknown as NonNullable<
				typeof opts.postcssOptions
			>;
		},
	},
});
