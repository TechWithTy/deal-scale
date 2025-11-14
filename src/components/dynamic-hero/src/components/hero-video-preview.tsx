"use client";

import React, {
	type HTMLAttributes,
	useImperativeHandle,
	useCallback,
	useState,
	forwardRef,
} from "react";

import { Pointer } from "@/components/ui/pointer";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";

import type { HeroVideoConfig } from "../types/video";
import { resolveHeroThumbnailSrc } from "../utils/video";
import { HeroVideoDialog } from "./hero-video-dialog";

export interface HeroVideoPreviewProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	video?: HeroVideoConfig;
	thumbnailAlt?: string;
}

export interface HeroVideoPreviewHandle {
	play: () => void;
	stop: () => void;
}

export const DEFAULT_HERO_VIDEO: HeroVideoConfig = {
	src: "https://www.youtube.com/embed/qh3NGpYRG3I?rel=0&controls=1&modestbranding=1",
	poster: "/images/quickstart/video-preview.svg",
	provider: "youtube",
};

export const HeroVideoPreview = forwardRef<
	HeroVideoPreviewHandle,
	HeroVideoPreviewProps
>(function HeroVideoPreview(
	{
		video,
		className,
		thumbnailAlt = "Watch product demo",
		...containerProps
	}: HeroVideoPreviewProps,
	ref,
) {
	const config = video ?? DEFAULT_HERO_VIDEO;
	const poster = resolveHeroThumbnailSrc(config, DEFAULT_HERO_VIDEO.poster);
	const [isPlaying, setIsPlaying] = useState(false);
	const handleOpenChange = useCallback((next: boolean) => {
		setIsPlaying(next);
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			play: () => setIsPlaying(true),
			stop: () => setIsPlaying(false),
		}),
		[],
	);

	return (
		<div
			className={cn(
				"relative mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-border/40 bg-background/80 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] backdrop-blur-lg",
				"ring-1 ring-border/30",
				className,
			)}
			{...containerProps}
		>
			{!isPlaying ? (
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/10 opacity-70" />
			) : null}

			<div className="relative z-10 w-full">
				<div className="relative w-full overflow-hidden rounded-[28px] border border-border/30 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)]">
					<div className="aspect-video w-full">
						<HeroVideoDialog
							className="absolute inset-0"
							video={{ ...config, poster }}
							thumbnailAlt={thumbnailAlt}
							animationStyle="from-center"
							open={isPlaying}
							onOpenChange={handleOpenChange}
						/>
					</div>
				</div>
				{!isPlaying ? <Pointer className="text-primary" /> : null}
			</div>

			{!isPlaying ? (
				<>
					<ProgressiveBlur
						position="top"
						height="28%"
						className="hidden md:block"
						blurLevels={[1, 2, 4, 8, 16, 24, 32, 48]}
					/>
					<ProgressiveBlur
						position="bottom"
						height="38%"
						className="hidden md:block"
						blurLevels={[1, 2, 4, 8, 16, 20, 28, 40]}
					/>
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-background/85 to-background" />
				</>
			) : null}
		</div>
	);
});
