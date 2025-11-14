import "tsconfig-paths/register";

import { DEFAULT_SEO, STATIC_SEO_META } from "../../src/data/constants/seo";

type ValidationErrors = {
	pass: boolean;
	errors: string[];
};

type ValidationResult = {
	title: ValidationErrors;
	description: ValidationErrors;
};

const BRAND_PREFIXES = [/^DealScale/, /^Deal Scale/];
const TITLE_KEYWORD_REGEX =
	/(AI|Real Estate|Conversations|Automation|Deal Flow|Conversions)/i;
const DESCRIPTION_KEYWORDS_REGEX =
	/(AI|Real Estate|Investor|Automate|Deal Flow|Lead|Call|Text)/gi;
const VALUE_PROPOSITION_REGEX =
	/(automate outreach|qualify sellers|book more appointments|voice calling|real calls|CRM)/i;
const SPAM_REGEX = /(FREE|BUY NOW|CHEAP|!!!)/i;

function countMatches(source: string, regex: RegExp): number {
	const matches = source.match(regex);
	return matches ? matches.length : 0;
}

function containsDuplicateAI(source: string): boolean {
	return countMatches(source, /AI/gi) > 1;
}

export function validateSEO(
	title: string,
	description: string,
): ValidationResult {
	const results: ValidationResult = {
		title: { pass: true, errors: [] },
		description: { pass: true, errors: [] },
	};

	// Title validations
	if (title.length < 45 || title.length > 65) {
		results.title.pass = false;
		results.title.errors.push("Title must be 45–65 characters.");
	}

	if (!BRAND_PREFIXES.some((regex) => regex.test(title))) {
		results.title.pass = false;
		results.title.errors.push("Title must start with brand name.");
	}

	if (!TITLE_KEYWORD_REGEX.test(title)) {
		results.title.pass = false;
		results.title.errors.push("Missing primary intent keyword.");
	}

	if (containsDuplicateAI(title)) {
		results.title.pass = false;
		results.title.errors.push("Duplicate 'AI' keyword found.");
	}

	if (SPAM_REGEX.test(title)) {
		results.title.pass = false;
		results.title.errors.push("Spam or salesy language detected.");
	}

	// Description validations
	if (description.length < 120 || description.length > 165) {
		results.description.pass = false;
		results.description.errors.push("Description must be 120–165 characters.");
	}

	if (countMatches(description, DESCRIPTION_KEYWORDS_REGEX) < 2) {
		results.description.pass = false;
		results.description.errors.push(
			"Description must contain at least two primary keywords.",
		);
	}

	if (!VALUE_PROPOSITION_REGEX.test(description)) {
		results.description.pass = false;
		results.description.errors.push(
			"Description missing clear value proposition.",
		);
	}

	if (/[\n\r]/.test(description)) {
		results.description.pass = false;
		results.description.errors.push(
			"Description must be a single sentence (no line breaks).",
		);
	}

	if (SPAM_REGEX.test(description)) {
		results.description.pass = false;
		results.description.errors.push("Spam or salesy terms detected.");
	}

	if (containsDuplicateAI(description)) {
		results.description.pass = false;
		results.description.errors.push("Duplicate 'AI' keyword detected.");
	}

	return results;
}

const seoTargets = [
	{ label: "DEFAULT_SEO", seo: DEFAULT_SEO },
	{ label: "STATIC_HOME", seo: STATIC_SEO_META["/"] },
];

let hasFailures = false;

for (const { label, seo } of seoTargets) {
	const { title = "", description = "" } = seo;
	const result = validateSEO(title, description);
	const titlePass = result.title.pass ? "PASS" : "FAIL";
	const descriptionPass = result.description.pass ? "PASS" : "FAIL";

	console.log(
		`[${label}] Title: ${titlePass}, Description: ${descriptionPass}`,
	);
	if (!result.title.pass || !result.description.pass) {
		hasFailures = true;
		console.dir(result, { depth: null });
	}
}

if (hasFailures) {
	console.error("Meta description/title validation failed.");
	process.exit(1);
}

console.log("Meta description/title validation passed.");
