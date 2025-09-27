import { gdprPolicyMarkdown } from "@/data/constants/legal/GDPR";
import { PIIMarkdown } from "@/data/constants/legal/PII";
import { cookiesPolicyMarkdown } from "@/data/constants/legal/cookies";
import { hipaaMarkdown } from "@/data/constants/legal/hippa";
import { privacyPolicyMarkdown } from "@/data/constants/legal/privacy";
import { tcpComplianceMarkdown } from "@/data/constants/legal/tcpCompliance";
import { termsOfServiceMarkdown } from "@/data/constants/legal/terms";

export interface LegalDocument {
	slug: string;
	title: string;
	description: string;
	lastUpdated: string;
	content: string;
}

export const legalDocuments: LegalDocument[] = [
	{
		slug: "privacy-policy",
		title: "Privacy Policy",
		description: "How we collect, use, and protect your data.",
		lastUpdated: "2024-07-23",
		content: privacyPolicyMarkdown,
	},
	{
		slug: "terms-of-service",
		title: "Terms of Service",
		description: "Your legal agreement for using Deal Scale.",
		lastUpdated: "2024-07-23",
		content: termsOfServiceMarkdown,
	},
	{
		slug: "cookie-policy",
		title: "Cookie Policy",
		description: "How we use cookies and similar technologies.",
		lastUpdated: "2024-07-23",
		content: cookiesPolicyMarkdown,
	},
	{
		slug: "tcpa-compliance",
		title: "TCPA Compliance",
		description: "Our compliance with the Telephone Consumer Protection Act.",
		lastUpdated: "2024-07-23",
		content: tcpComplianceMarkdown,
	},
	{
		slug: "gdpr-policy",
		title: "GDPR Policy",
		description: "Our data practices for EU/EEA residents.",
		lastUpdated: "2024-07-23",
		content: gdprPolicyMarkdown,
	},
	{
		slug: "hipaa-policy",
		title: "HIPAA Policy",
		description: "How we safeguard protected health information (PHI).",
		lastUpdated: "2024-07-23",
		content: hipaaMarkdown,
	},
	{
		slug: "pii-handling-policy",
		title: "PII Handling Policy",
		description: "How we handle personally identifiable information.",
		lastUpdated: "2024-07-23",
		content: PIIMarkdown,
	},
];
