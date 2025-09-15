import type { ButtonProps } from "@/components/ui/button";

export type SocialPlatform = "facebook" | "twitter" | "linkedin";

export interface PlatformTextConfig {
	/** Default text template function */
	template?: (text: string, url: string) => string;
	/** Maximum allowed characters for this platform */
	maxLength?: number;
	/** Whether to include URL in the shared text */
	includeUrl?: boolean;
}

export interface PlatformConfig {
	/** Display label for the platform */
	label: string;
	/** Network identifier (used for icons/class names) */
	network: string;
	/** Text configuration for sharing */
	text?: PlatformTextConfig;
}

export interface SocialShareBaseProps {
	/** URL to be shared (defaults to current page URL) */
	url?: string;
	/** Optional title for the shared content (defaults to page title) */
	title?: string;
	/** Optional text/tweet content for Twitter (defaults to meta description) */
	text?: string;
	/** Optional summary for LinkedIn (defaults to meta description) */
	summary?: string;
	/** Custom class name for the container */
	className?: string;
	/** Size of the buttons */
	size?: "sm" | "default" | "lg";
	/** Variant of the buttons */
	variant?: ButtonProps["variant"];
	/** Whether to show labels on the buttons */
	showLabels?: boolean;
	/** Whether to show the share button */
	showShareButton?: boolean;
}
