import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

const projectRoot = path.resolve(__dirname, "../../");
const srcDir = path.resolve(projectRoot, "src");
const dynamicHeroSrc = path.resolve(
	projectRoot,
	"src/components/dynamic-hero/src",
);

export default defineConfig({
	root: __dirname,
	plugins: [react()],
	resolve: {
		alias: [
			{ find: "@", replacement: srcDir },
			{
				find: "@external/dynamic-hero",
				replacement: path.join(dynamicHeroSrc),
			},
			{
				find: /^@external\/dynamic-hero\/(.*)$/u,
				replacement: path.join(dynamicHeroSrc, "$1"),
			},
			{
				find: "next/image",
				replacement: path.resolve(__dirname, "src/shims/next-image.tsx"),
			},
			{
				find: "next/link",
				replacement: path.resolve(__dirname, "src/shims/next-link.tsx"),
			},
			{
				find: "server-only",
				replacement: path.resolve(__dirname, "src/shims/server-only.ts"),
			},
		],
	},
	publicDir: path.resolve(projectRoot, "public"),
	css: {
		postcss: path.resolve(projectRoot, "postcss.config.js"),
	},
	define: {
		"process.env.NEXT_PUBLIC_ENV": JSON.stringify(
			process.env.NEXT_PUBLIC_ENV ?? "preview",
		),
	},
	envDir: projectRoot,
	envPrefix: ["NEXT_PUBLIC_"],
	server: {
		port: 5173,
		open: true,
	},
	preview: {
		port: 4173,
	},
	build: {
		outDir: path.resolve(projectRoot, "dist/vite-preview"),
		emptyOutDir: true,
	},
});




