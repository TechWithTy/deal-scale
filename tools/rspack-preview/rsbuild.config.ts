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
			if (
				typeof opts.postcssOptions === "object" &&
				opts.postcssOptions !== null
			) {
				opts.postcssOptions.config = path.resolve(
					projectRoot,
					"postcss.config.js",
				);
			} else {
				opts.postcssOptions = {
					config: path.resolve(projectRoot, "postcss.config.js"),
				};
			}
		},
	},
});
