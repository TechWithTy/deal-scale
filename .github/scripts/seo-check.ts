import { readFile } from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";

const REQUIRED_META = [
	{ selector: 'meta[name="description"]', label: "description" },
	{ selector: 'meta[property="og:title"]', label: "og:title" },
	{ selector: 'meta[property="og:description"]', label: "og:description" },
	{ selector: 'meta[property="og:image"]', label: "og:image" },
	{ selector: 'meta[name="twitter:card"]', label: "twitter:card" },
	{ selector: 'link[rel="canonical"]', label: "canonical" },
];

const DIST_DIR =
	process.env.LANDING_DIST_DIR ?? path.resolve(process.cwd(), "dist");
const ENTRY_FILE = path.join(DIST_DIR, "index.html");

async function loadDom() {
	try {
		const markup = await readFile(ENTRY_FILE, "utf-8");
		return new JSDOM(markup);
	} catch (error) {
		console.error(`Failed to read ${ENTRY_FILE}. Did you run pnpm landing:build?`);
		throw error;
	}
}

function validateMeta(dom: JSDOM) {
	const head = dom.window.document.head;
	const missing = REQUIRED_META.filter(
		(meta) => head.querySelector(meta.selector) === null,
	);

	if (missing.length > 0) {
		throw new Error(
			`Missing required meta tags:\n- ${missing
				.map((meta) => meta.label)
				.join("\n- ")}`,
		);
	}
}

function validateImages(dom: JSDOM) {
	const images = Array.from(dom.window.document.querySelectorAll("img"));
	const withoutAlt = images.filter((img) => {
		const alt = img.getAttribute("alt");
		return !alt || alt.trim().length === 0;
	});

	if (withoutAlt.length > 0) {
		const sample = withoutAlt
			.slice(0, 5)
			.map((img) => img.getAttribute("src") ?? "unknown src");
		throw new Error(
			`Found ${withoutAlt.length} <img> tags without alt text. Sample: ${sample.join(", ")}`,
		);
	}
}

async function main() {
	const dom = await loadDom();
	validateMeta(dom);
	validateImages(dom);

	console.log("✅ SEO metadata and image alt text validated.");
}

main().catch((error) => {
	console.error("❌ SEO validation failed.");
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});




