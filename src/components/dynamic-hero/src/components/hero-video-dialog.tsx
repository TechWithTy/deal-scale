"use client";

import { Play, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import type { HeroVideoConfig } from "../types/video";
import {
	resolveHeroThumbnailSrc,
	resolveHeroVideoSrc,
	shouldBypassImageOptimization,
	isVideoThumbnail,
} from "../utils/video";

export interface HeroVideoDialogProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	video: HeroVideoConfig;
	animationStyle?:
		| "from-bottom"
		| "from-center"
		| "from-top"
		| "from-left"
		| "from-right"
		| "fade"
		| "top-in-bottom-out"
		| "left-in-right-out";
	thumbnailAlt?: string;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
}

const animationPresets = {
	"from-bottom": {
		initial: { y: "100%", opacity: 0 },
		animate: { y: 0, opacity: 1 },
		exit: { y: "100%", opacity: 0 },
	},
	"from-center": {
		initial: { scale: 0.5, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0.5, opacity: 0 },
	},
	"from-top": {
		initial: { y: "-100%", opacity: 0 },
		animate: { y: 0, opacity: 1 },
		exit: { y: "-100%", opacity: 0 },
	},
	"from-left": {
		initial: { x: "-100%", opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: "-100%", opacity: 0 },
	},
	"from-right": {
		initial: { x: "100%", opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: "100%", opacity: 0 },
	},
	fade: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	},
	"top-in-bottom-out": {
		initial: { y: "-100%", opacity: 0 },
		animate: { y: 0, opacity: 1 },
		exit: { y: "100%", opacity: 0 },
	},
	"left-in-right-out": {
		initial: { x: "-100%", opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: "100%", opacity: 0 },
	},
} as const;

export function HeroVideoDialog({
	video,
	animationStyle = "from-center",
	thumbnailAlt = "Video thumbnail",
	className,
	open,
	defaultOpen = false,
	onOpenChange,
	...containerProps
}: HeroVideoDialogProps): JSX.Element {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isControlled = open !== undefined;
	const isOpen = isControlled ? Boolean(open) : internalOpen;
	const preset = useMemo(
		() => animationPresets[animationStyle] ?? animationPresets["from-center"],
		[animationStyle],
	);

	const videoSrc = resolveHeroVideoSrc(video);
	const thumbnailSrc = resolveHeroThumbnailSrc(video);
	const unoptimizedThumbnail = shouldBypassImageOptimization(thumbnailSrc);
	const isVideoPoster = isVideoThumbnail(thumbnailSrc);
	const setOpen = useCallback(
		(next: boolean) => {
			if (!isControlled) {
				setInternalOpen(next);
			}
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange],
	);

	useEffect(() => {
		if (isControlled) {
			onOpenChange?.(Boolean(open));
		}
	}, [isControlled, onOpenChange, open]);

	const openModal = () => {
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};
	return (
		<div
			className={cn("relative h-full w-full", className)}
			{...containerProps}
		>
			{!isOpen ? (
				<button
					type="button"
					aria-label="Play video"
					className="group absolute inset-0 z-20 cursor-pointer overflow-hidden rounded-[28px] border-0 bg-transparent p-0 transition duration-200 ease-out"
					onClick={openModal}
				>
					{isVideoPoster ? (
						<video
							src={thumbnailSrc}
							role="img"
							aria-label={thumbnailAlt}
							className="size-full object-cover transition-all duration-200 ease-out group-hover:brightness-[0.92]"
							autoPlay
							loop
							muted
							playsInline
							preload="auto"
						/>
					) : (
						<Image
							src={thumbnailSrc}
							alt={thumbnailAlt}
							fill
							unoptimized={unoptimizedThumbnail}
							priority
							className="object-cover transition-all duration-200 ease-out group-hover:brightness-[0.92]"
						/>
					)}
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 bottom-[-2px] h-[22%] rounded-t-[32px] bg-gradient-to-t from-background/90 via-background/60 to-transparent opacity-95 transition duration-200 ease-out"
					/>
					<div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
						<div className="flex size-28 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md">
							<div className="relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
								<Play
									className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
									style={{
										filter:
											"drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
									}}
								/>
							</div>
						</div>
					</div>
				</button>
			) : null}
			<AnimatePresence>
				{isOpen ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
						onClick={closeModal}
						onKeyDown={(event) => {
							if (
								event.key === "Escape" ||
								event.key === "Enter" ||
								event.key === " "
							) {
								event.preventDefault();
								closeModal();
							}
						}}
						tabIndex={0}
					>
						<motion.div
							{...preset}
							transition={{ type: "spring", damping: 30, stiffness: 300 }}
							className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
							onClick={(event) => event.stopPropagation()}
						>
							<motion.button
								type="button"
								onClick={closeModal}
								aria-label="Close video"
								className="-top-16 absolute right-0 rounded-full bg-neutral-900/50 p-2 text-white text-xl ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black"
							>
								<XIcon className="size-5" />
							</motion.button>
							<div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
								<iframe
									src={videoSrc}
									title="Hero Video player"
									className="size-full rounded-2xl"
									allowFullScreen
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								/>
							</div>
						</motion.div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
