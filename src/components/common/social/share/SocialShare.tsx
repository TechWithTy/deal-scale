"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { platformConfigs } from "@/data/social/share";
import { cn } from "@/lib/utils";
import type {
	PlatformConfig,
	SocialPlatform,
	SocialShareBaseProps,
} from "@/types/social/share";
import { useShareToSocial } from "@/utils/shareToSocial";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ShareButton } from "./ShareButton";
import { SocialIconButton } from "./SocialIconButton";

type SharePosition = "left" | "center";

interface SocialShareProps extends SocialShareBaseProps {
	/** Title to display before the share buttons */
	shareTitle?: string;
	/** Maximum number of share buttons to show (default: 3) */
	maxButtons?: number;
	/** Position of the share text relative to buttons */
	position?: SharePosition;
	/** Custom text for each platform */
	shareTexts?: Partial<Record<SocialPlatform, string>>;
	/** Custom templates for each platform */
	shareTemplates?: Partial<
		Record<SocialPlatform, (text: string, url: string) => string>
	>;
	/** Default share text to use for platforms that support it (Facebook, LinkedIn) */
	defaultShareText?: string;
}

export function SocialShare({
	url: propUrl,
	title: propTitle,
	text: propText,
	summary: propSummary,
	className,
	showLabels = false,
	showShareButton = false,
	size = "default",
	variant = "outline",
	shareTitle = "Share to:",
	maxButtons = 3,
	position = "left",
	shareTexts = {},
	shareTemplates = {},
	defaultShareText = "Check out this",
}: SocialShareProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [pageTitle, setPageTitle] = useState(propTitle || "");
	const [pageText, setPageText] = useState(propText || "");
	const [pageSummary, setPageSummary] = useState(propSummary || "");
	const [isOpen, setIsOpen] = useState(false);
	const { shareToFacebook, shareToX, shareToLinkedIn } = useShareToSocial();

	// Clean URL parameters to remove empty values and trailing ?
	const cleanUrlParams = useCallback((params: URLSearchParams): string => {
		const cleanParams = new URLSearchParams();
		for (const [key, value] of params.entries()) {
			if (value?.trim?.() !== "") {
				cleanParams.append(key, value);
			}
		}
		const paramString = cleanParams.toString();
		return paramString ? `?${paramString}` : "";
	}, []);

	// Always use dealscale.io as the domain for sharing
	const PRODUCTION_DOMAIN = "https://dealscale.io";

	// Get the current URL if none is provided
	const url = useMemo(() => {
		try {
			// Use provided URL or construct from current location
			if (propUrl) {
				const url = new URL(propUrl);
				// Clean up any empty query parameters
				url.search = cleanUrlParams(new URLSearchParams(url.search));
				// Ensure we're using the production domain
				url.hostname = "dealscale.io";
				url.protocol = "https:";
				return url.toString();
			}

			// Clean up pathname
			let cleanPathname = pathname;
			if (!cleanPathname.startsWith("/")) {
				cleanPathname = `/${cleanPathname}`;
			}

			// Clean up search params
			let cleanSearch = "";
			const searchParamsStr = searchParams?.toString();
			if (searchParamsStr) {
				cleanSearch = cleanUrlParams(new URLSearchParams(searchParamsStr));
			}

			// Construct final URL with the production domain
			const fullUrl = `${PRODUCTION_DOMAIN}${cleanPathname}${cleanSearch}`;

			// Validate URL
			new URL(fullUrl); // Will throw if invalid
			return fullUrl;
		} catch (error) {
			console.error("Error constructing share URL:", error);
			return "";
		}
	}, [propUrl, pathname, searchParams, cleanUrlParams]);

	// Get page metadata on client side
	useEffect(() => {
		if (!propTitle) {
			setPageTitle(document.title);
		}

		if (!propText && !propSummary) {
			const metaDescription =
				document
					.querySelector('meta[name="description"]')
					?.getAttribute("content") ||
				document
					.querySelector('meta[property="og:description"]')
					?.getAttribute("content");
			if (metaDescription) {
				setPageText(metaDescription);
				setPageSummary(metaDescription);
			}
		}
	}, [propTitle, propText, propSummary]);

	const handleShare = (platform: SocialPlatform) => {
		console.group("Social Share Debug");
		console.log("Platform:", platform);

		const shareTitle = propTitle || pageTitle;
		// Start with the base share text (page text or empty string)
		const shareText = propText || pageText || "";
		const shareSummary = propSummary || pageSummary;

		console.log("Share Title:", shareTitle);
		console.log("Share Text:", shareText);
		console.log("Share Summary:", shareSummary);
		console.log("Default Share Text:", defaultShareText);
		console.log("Share Texts:", shareTexts);

		// Platform-specific text handling
		let platformText = "";

		// For Facebook and LinkedIn, use the default share text if available
		// For other platforms, only use explicitly provided text
		let textToShare = "";

		if (platform === "facebook" || platform === "linkedin") {
			// For Facebook and LinkedIn, use default share text if available
			textToShare =
				shareTexts?.[platform] ||
				(defaultShareText ? `${defaultShareText} ${shareTitle}`.trim() : "") ||
				shareText;
		} else {
			// For other platforms, only use explicitly provided text
			textToShare = shareTexts?.[platform] || shareText;
		}

		console.log("Final textToShare:", textToShare);
		console.log("Share URL:", url);

		// Apply custom template if provided
		if (shareTemplates?.[platform]) {
			platformText = shareTemplates[platform](textToShare, url);
		} else {
			// Default text formatting based on platform
			switch (platform) {
				case "twitter":
					// For X, include the URL in the text for better visibility
					platformText = textToShare.trim();
					if (!platformText.endsWith(url) && !platformText.includes(url)) {
						platformText = `${platformText} ${url}`.trim();
					}
					break;
				case "facebook":
					// For Facebook, use the summary if no text is provided
					platformText = textToShare || shareSummary || "";
					break;
				case "linkedin":
					// For LinkedIn, prefer the title + summary
					platformText = [shareTitle, textToShare || shareSummary]
						.filter(Boolean)
						.join(" - ")
						.trim();
					break;
			}
		}

		// Share with the formatted text
		try {
			switch (platform) {
				case "facebook":
					console.log("Sharing to Facebook with text:", textToShare);
					shareToFacebook(url, textToShare);
					break;
				case "twitter":
					console.log("Sharing to X/Twitter with text:", textToShare);
					shareToX(url, textToShare);
					break;
				case "linkedin":
					console.log(
						"Sharing to LinkedIn with title:",
						shareTitle,
						"and text:",
						textToShare,
					);
					shareToLinkedIn(url, shareTitle, textToShare);
					break;
			}
		} catch (error) {
			console.error("Error during sharing:", error);
		} finally {
			console.groupEnd();
			setIsOpen(false);
		}
	};

	const renderSocialButton = (platform: SocialPlatform) => {
		const config = platformConfigs[platform];
		return (
			<Tooltip key={platform}>
				<TooltipTrigger asChild>
					<SocialIconButton
						platform={platform}
						config={config}
						size={size}
						variant={variant as "default" | "outline" | "ghost" | "link"}
						showLabel={showLabels}
						isVisible={!showShareButton || isOpen}
						onClick={() => handleShare(platform)}
					/>
				</TooltipTrigger>
				{!showLabels && <TooltipContent>{config.label}</TooltipContent>}
			</Tooltip>
		);
	};

	const renderShareButtons = () => {
		// Get all available platforms
		const platforms = useMemo(
			() =>
				Object.entries(platformConfigs).map(([key, config]) => ({
					key: key as SocialPlatform,
					...config,
				})) as Array<PlatformConfig & { key: SocialPlatform }>,
			[],
		);

		return (
			<div
				className={cn(
					"flex items-center gap-3",
					{
						"justify-start": position === "left",
						"justify-center": position === "center",
					},
					className,
				)}
			>
				{shareTitle && position === "left" && (
					<span className="font-medium text-foreground/80 text-sm">
						{shareTitle}
					</span>
				)}
				<div className="flex items-center gap-1">
					{platforms.map((platform) => renderSocialButton(platform.key))}
				</div>
				{shareTitle && position === "center" && (
					<span className="font-medium text-foreground/80 text-sm">
						{shareTitle}
					</span>
				)}
			</div>
		);
	};

	const socialButtons = renderShareButtons();

	if (showShareButton) {
		return (
			<TooltipProvider>
				<div className={cn("relative inline-flex items-center", className)}>
					<Tooltip>
						<TooltipTrigger asChild>
							<ShareButton
								size={size}
								variant={variant as "default" | "outline" | "ghost" | "link"}
								isOpen={isOpen}
								showLabels={showLabels}
								onClick={() => setIsOpen(!isOpen)}
							/>
						</TooltipTrigger>
						<TooltipContent>Share on social media</TooltipContent>
					</Tooltip>
					<div
						className={cn(
							"absolute inset-x-0 z-10 mt-2 flex items-center justify-center space-x-2 rounded-full border bg-background p-2 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
							isOpen
								? "translate-y-0 opacity-100"
								: "-translate-y-2 pointer-events-none opacity-0",
							{
								"w-auto": !showLabels,
								"w-full": showLabels,
							},
						)}
					>
						{socialButtons}
					</div>
				</div>
			</TooltipProvider>
		);
	}

	return <TooltipProvider>{renderShareButtons()}</TooltipProvider>;
}
