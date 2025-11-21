"use client";

import {
	type HeroVideoPreviewHandle,
	resolveHeroThumbnailSrc,
	useHeroVideoConfig,
} from "@external/dynamic-hero";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";

import { LIVE_VIDEO } from "./_config";

const HERO_POSTER_FALLBACK = resolveHeroThumbnailSrc(
	LIVE_VIDEO,
	LIVE_VIDEO.poster,
);

const HeroVideoPreviewDynamic = dynamic(
	() => import("@external/dynamic-hero").then((mod) => mod.HeroVideoPreview),
	{
		ssr: false,
		loading: () => (
			<HeroVideoPreviewSkeleton
				posterSrc={HERO_POSTER_FALLBACK}
				alt="Product demo preview"
			/>
		),
	},
);

function HeroVideoPreviewSkeleton({
	posterSrc,
	alt,
}: {
	posterSrc: string;
	alt: string;
}) {
	return (
		<div className="relative w-full overflow-hidden rounded-[32px] border border-border/40 bg-background/80 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] ring-1 ring-border/30 backdrop-blur-lg">
			<div className="relative w-full overflow-hidden rounded-[28px] border border-border/30 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)]">
				<div className="relative aspect-video w-full">
					<Image
						src={posterSrc}
						alt={alt}
						fill
						className="object-cover"
						priority
						sizes="(min-width: 1280px) 1024px, (min-width: 768px) 768px, 100vw"
					/>
				</div>
			</div>
		</div>
	);
}

export default function HeroVideoSection(): JSX.Element {
	const videoPreviewRef = useRef<HeroVideoPreviewHandle>(null);
	const heroVideo = useHeroVideoConfig(LIVE_VIDEO);

	return (
		<section className="relative w-full bg-background/50 py-12 md:py-16 lg:py-20">
			<div className="container mx-auto w-full px-6 md:px-10 lg:px-12">
				<div className="mx-auto w-full max-w-5xl">
					<div className="flex w-full items-center justify-center">
						<div className="w-full">
							<HeroVideoPreviewDynamic
								ref={videoPreviewRef}
								video={heroVideo}
								thumbnailAlt="Live dynamic hero video preview"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
