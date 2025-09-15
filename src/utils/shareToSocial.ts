import { useCallback } from "react";

import { platformConfigs } from "@/data/social/share";

/**
 * Format text for sharing based on platform configuration
 */
const formatShareText = (
	platform: "facebook" | "twitter" | "linkedin",
	text: string,
	url: string,
	title?: string,
): string => {
	// Ensure text is always a string
	const safeText = text || "";
	const config = platformConfigs[platform];
	if (!config.text) return text;

	// Use the platform's template if available, otherwise use the raw text
	let formattedText = config.text.template
		? config.text.template(safeText, url)
		: safeText;

	// Apply max length if specified
	if (config.text.maxLength) {
		formattedText = formattedText.slice(0, config.text.maxLength);
	}

	return formattedText;
};

/**
 * Share a URL on Facebook
 * @param url The URL to share
 * @param text Optional text to include in the share
 */
export const shareToFacebook = (url: string, text?: string) => {
	// Facebook will automatically include the URL in the share
	// We just need to make sure the URL is the first parameter
	const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

	// Debug output
	console.group("Facebook Share Debug");
	console.log("Sharing URL:", url);
	console.log("Share text:", text || "(none)");
	console.log("Generated share URL:", shareUrl);
	console.groupEnd();

	window.open(shareUrl, "_blank", "width=600,height=400");
};

/**
 * Share a URL on X (formerly Twitter)
 * @param url The URL to share
 * @param text Optional text to include in the post
 */
export const shareToX = (url: string, text?: string) => {
	// For X, we need to include both text and URL in the tweet text
	let tweetText = text ? `${text} ${url}` : url;
	// Ensure we don't exceed Twitter's character limit (280 chars)
	if (tweetText.length > 280) {
		const maxTextLength = 280 - url.length - 4; // Leave space for "..." and a space
		tweetText = `${text?.substring(0, maxTextLength)}... ${url}`;
	}
	const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

	// Debug output
	console.group("X (Twitter) Share Debug");
	console.log("Sharing URL:", url);
	console.log("Original text:", text || "(none)");
	console.log("Final tweet text:", tweetText);
	console.log("Generated share URL:", shareUrl);
	console.log("Tweet length:", tweetText.length, "characters");
	console.groupEnd();

	window.open(shareUrl, "_blank", "width=600,height=400");
};

/**
 * Share a URL on LinkedIn
 * @param url The URL to share
 * @param title Optional title for the shared content
 * @param summary Optional summary/description for the shared content
 */
export const shareToLinkedIn = (
	url: string,
	title?: string,
	summary?: string,
) => {
	// LinkedIn's share URL will automatically include the URL
	// We just need to pass the URL as the main parameter
	const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

	// Debug output
	console.group("LinkedIn Share Debug");
	console.log("Sharing URL:", url);
	console.log("Title:", title || "(none)");
	console.log("Summary:", summary || "(none)");
	console.log("Generated share URL:", shareUrl);
	console.groupEnd();

	window.open(shareUrl, "_blank", "width=600,height=400");
};

/**
 * React hook for using social share functions in components
 */
export function useShareToSocial() {
	const shareFb = useCallback((url: string, text?: string) => {
		shareToFacebook(url, text);
	}, []);

	const shareTw = useCallback((url: string, text?: string) => {
		shareToX(url, text);
	}, []);

	const shareLi = useCallback(
		(url: string, title?: string, summary?: string) => {
			shareToLinkedIn(url, title, summary);
		},
		[],
	);

	return {
		shareToFacebook: shareFb,
		shareToX: shareTw,
		shareToLinkedIn: shareLi,
	};
}
