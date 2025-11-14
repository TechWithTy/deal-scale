"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SocialShareBaseProps } from "@/types/social/share";
import { usePathname, useSearchParams } from "next/navigation";
import { SocialShare as MainSocialShare } from "./share";
export * from "./share";

/**
 * Convenience component for a simple Facebook share button
 */
export const FacebookShare = (
	props: Omit<
		SocialShareBaseProps,
		"showLabels" | "showShareButton" | "url"
	> & {
		url?: string;
	},
) => <MainSocialShare {...props} showLabels={false} showShareButton={false} />;

/**
 * Convenience component for a simple X (Twitter) share button
 */
export const TwitterShare = (
	props: Omit<
		SocialShareBaseProps,
		"showLabels" | "showShareButton" | "url"
	> & {
		url?: string;
	},
) => <MainSocialShare {...props} showLabels={false} showShareButton={false} />;

/**
 * Convenience component for a simple LinkedIn share button
 */
export const LinkedInShare = (
	props: Omit<
		SocialShareBaseProps,
		"showLabels" | "showShareButton" | "url"
	> & {
		url?: string;
	},
) => <MainSocialShare {...props} showLabels={false} showShareButton={false} />;

/**
 * Default export for backward compatibility
 */
const SocialShare = (props: SocialShareBaseProps) => (
	<MainSocialShare {...props} />
);

export default SocialShare;
