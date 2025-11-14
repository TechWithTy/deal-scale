import type { PlatformConfig, SocialPlatform } from "@/types/social/share";

export const platformConfigs: Record<SocialPlatform, PlatformConfig> = {
	facebook: {
		label: "Share on Facebook",
		network: "facebook",
		text: {
			maxLength: 5000,
			includeUrl: true,
			template: (text, url) => `${text} ${url}`.trim(),
		},
	},
	twitter: {
		label: "Share on X (formerly Twitter)",
		network: "x",
		text: {
			maxLength: 280,
			includeUrl: true,
			template: (text, url) => {
				const maxTextLength = 250 - url.length; // Reserve space for URL and spaces
				const truncatedText =
					text.length > maxTextLength
						? `${text.substring(0, maxTextLength - 3)}...`
						: text;
				return `${truncatedText} ${url}`.trim();
			},
		},
	},
	linkedin: {
		label: "Share on LinkedIn",
		network: "linkedin",
		text: {
			maxLength: 3000,
			includeUrl: true,
			template: (text, url) => `${text} ${url}`.trim(),
		},
	},
} as const;
