#!/usr/bin/env tsx
/**
 * Local sitemap validation script
 * Validates the sitemap before deployment to catch errors early
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Import the sitemap function
import sitemap from "../src/app/sitemap";

interface ValidationError {
	type: "error" | "warning";
	message: string;
	url?: string;
	line?: number;
}

interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
	totalUrls: number;
	externalUrls: string[];
	canonicalHost: string;
}

/**
 * Extract hostname from URL
 */
function getHost(url: string): string {
	try {
		return new URL(url).host;
	} catch {
		return "";
	}
}

/**
 * Validate sitemap entries
 */
async function validateSitemap(): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const externalUrls: string[] = [];

	// Generate sitemap
	console.log("📋 Generating sitemap...");
	const entries = await sitemap();

	// Get canonical host
	const canonicalHost = entries[0]?.url ? getHost(entries[0].url) : "";

	console.log(`✅ Generated ${entries.length} sitemap entries`);

	// Validate each entry
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		const line = i + 1;

		if (!entry.url) {
			errors.push({
				type: "error",
				message: "Entry missing URL",
				line,
			});
			continue;
		}

		// Check for external URLs
		const entryHost = getHost(entry.url);
		if (entryHost && entryHost !== canonicalHost) {
			externalUrls.push(entry.url);
			errors.push({
				type: "error",
				message: `External URL not allowed in sitemap: ${entry.url}`,
				url: entry.url,
				line,
			});
		}

		// Validate URL format
		try {
			new URL(entry.url);
		} catch {
			errors.push({
				type: "error",
				message: `Invalid URL format: ${entry.url}`,
				url: entry.url,
				line,
			});
		}

		// Validate priority
		if (entry.priority !== undefined) {
			if (entry.priority < 0 || entry.priority > 1) {
				errors.push({
					type: "warning",
					message: `Priority should be between 0.0 and 1.0: ${entry.priority}`,
					url: entry.url,
					line,
				});
			}
		}

		// Validate changeFrequency
		const validFrequencies = [
			"always",
			"hourly",
			"daily",
			"weekly",
			"monthly",
			"yearly",
			"never",
		];
		if (
			entry.changeFrequency &&
			!validFrequencies.includes(entry.changeFrequency)
		) {
			errors.push({
				type: "warning",
				message: `Invalid changeFrequency: ${entry.changeFrequency}`,
				url: entry.url,
				line,
			});
		}
	}

	// Check for duplicate URLs
	const urlSet = new Set<string>();
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		if (entry.url) {
			if (urlSet.has(entry.url)) {
				errors.push({
					type: "error",
					message: `Duplicate URL: ${entry.url}`,
					url: entry.url,
					line: i + 1,
				});
			}
			urlSet.add(entry.url);
		}
	}

	const valid = errors.filter((e) => e.type === "error").length === 0;

	return {
		valid,
		errors,
		totalUrls: entries.length,
		externalUrls,
		canonicalHost,
	};
}

/**
 * Generate XML sitemap for inspection
 */
async function generateXmlSitemap(): Promise<string> {
	const entries = await sitemap();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map((entry) => {
		const url = entry.url || "";
		const lastmod = entry.lastModified
			? entry.lastModified.toISOString().split("T")[0]
			: new Date().toISOString().split("T")[0];
		const changefreq = entry.changeFrequency || "weekly";
		const priority = entry.priority ?? 0.5;

		return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
	})
	.join("\n")}
</urlset>`;

	return xml;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Main validation function
 */
async function main() {
	console.log("🔍 Validating sitemap locally...\n");

	const result = await validateSitemap();

	// Print results
	console.log("\n📊 Validation Results:");
	console.log(`   Total URLs: ${result.totalUrls}`);
	console.log(`   Canonical Host: ${result.canonicalHost}`);
	console.log(`   External URLs Found: ${result.externalUrls.length}`);

	if (result.errors.length > 0) {
		console.log(`\n❌ Found ${result.errors.length} issue(s):\n`);

		const errors = result.errors.filter((e) => e.type === "error");
		const warnings = result.errors.filter((e) => e.type === "warning");

		if (errors.length > 0) {
			console.log("🚨 ERRORS:");
			for (const error of errors) {
				console.log(
					`   [Line ${error.line || "?"}] ${error.message}${
						error.url ? `\n      URL: ${error.url}` : ""
					}`,
				);
			}
		}

		if (warnings.length > 0) {
			console.log("\n⚠️  WARNINGS:");
			for (const warning of warnings) {
				console.log(
					`   [Line ${warning.line || "?"}] ${warning.message}${
						warning.url ? `\n      URL: ${warning.url}` : ""
					}`,
				);
			}
		}
	} else {
		console.log("\n✅ No validation errors found!");
	}

	// Generate XML file for inspection
	const xml = await generateXmlSitemap();
	const outputPath = join(process.cwd(), "sitemap-local.xml");
	writeFileSync(outputPath, xml, "utf-8");
	console.log(`\n📄 Generated XML sitemap: ${outputPath}`);

	// Exit with error code if validation failed
	if (!result.valid) {
		console.log(
			"\n❌ Sitemap validation failed. Please fix errors before deploying.",
		);
		process.exit(1);
	}

	console.log("\n✅ Sitemap is valid and ready for deployment!");
}

// Run validation
main().catch((error) => {
	console.error("❌ Validation script failed:", error);
	process.exit(1);
});
