import SafeMotionDiv from "@/components/ui/SafeMotionDiv";
import SplineModel from "@/components/ui/spline-model";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type React from "react";

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
	const isImageSrc = (img: unknown): img is string | StaticImageData =>
		typeof img === "string" ||
		(typeof img === "object" && img !== null && "src" in img);

	return (
		<div
			className={cn(
				"flex w-full items-center justify-center py-6",
				"sm:py-8 md:min-h-[360px] md:py-0 lg:min-h-[460px] xl:min-h-[520px]",
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
							<Image
								src={image}
								alt={imageAlt || "Hero Offering"}
								className="h-auto w-full rounded-xl object-contain"
								style={{
									filter: "drop-shadow(0 8px 32px rgba(80, 0, 255, 0.18))",
								}}
								sizes="(min-width: 1280px) 40vw, (min-width: 768px) 55vw, 90vw"
								width={800}
								height={800}
								priority
							/>
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
					<SplineModel />
				)}
			</div>
		</div>
	);
};
