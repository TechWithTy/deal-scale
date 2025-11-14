"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type React from "react";
import dynamic from "next/dynamic";
import SafeMotionDiv from "@/components/ui/SafeMotionDiv";
import SplinePlaceHolder from "@/components/ui/SplinePlaceHolder";

const LazySplineModel = dynamic(() => import("@/components/ui/spline-model"), {
	ssr: false,
	loading: () => <SplinePlaceHolder />,
});

export interface HeroOfferingProps {
	image?: string | StaticImageData | React.ReactNode;
	imageAlt?: string;
	className?: string;
}

/**
 * HeroOffering: animated product/visual/3D offering for Hero layouts.
 * - If image is provided (string or StaticImageData), animates it in.
 * - If image is a ReactNode, renders as-is (animated).
 * - Otherwise, falls back to SplineModel.
 */
export const HeroOffering: React.FC<HeroOfferingProps> = ({
	image,
	imageAlt,
	className,
}) => {
	const isMobile = useIsMobile();

	const isImageSrc = (img: unknown): img is string | StaticImageData =>
		typeof img === "string" ||
		(typeof img === "object" && img !== null && "src" in img);

	return (
		<div
			className={cn(
				"flex w-full items-center justify-center",
				isMobile
					? "py-6"
					: "min-h-[340px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[520px]",
				className,
			)}
		>
			<div className="relative mx-auto flex h-full w-full max-w-[18rem] items-center justify-center sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
				{image ? (
					isImageSrc(image) ? (
						<SafeMotionDiv
							initial={{ opacity: 0, scale: 0.8, y: 40 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{
								type: "spring",
								stiffness: 80,
								damping: 16,
								duration: 0.8,
							}}
						>
							<div className="flex w-full max-w-sm items-center justify-center p-0 sm:max-w-md md:max-w-lg">
								<Image
									src={image}
									alt={imageAlt || "Hero Offering"}
									className="h-auto w-full max-w-xs rounded-xl object-contain sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
									style={{
										filter: "drop-shadow(0 8px 32px rgba(80, 0, 255, 0.18))",
									}}
									width={800}
									height={800}
									priority
								/>
							</div>
						</SafeMotionDiv>
					) : (
						<SafeMotionDiv
							initial={{ opacity: 0, scale: 0.8, y: 40 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{
								type: "spring",
								stiffness: 80,
								damping: 16,
								duration: 0.8,
							}}
						>
							{image}
						</SafeMotionDiv>
					)
				) : (
					<LazySplineModel />
				)}
			</div>
		</div>
	);
};
