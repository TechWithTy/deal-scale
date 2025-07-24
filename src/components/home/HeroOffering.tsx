import SafeMotionDiv from "@/components/ui/SafeMotionDiv";
import SplineModel from "@/components/ui/spline-model";
import Image, { type StaticImageData } from "next/image";
import type React from "react";

export interface HeroOfferingProps {
	image?: string | StaticImageData | React.ReactNode;
	imageAlt?: string;
	isMobile?: boolean;
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
	isMobile,
	className,
}) => {
	// Helper: type guard for Next.js <Image /> src
	const isImageSrc = (img: unknown): img is string | StaticImageData =>
		typeof img === "string" ||
		(typeof img === "object" && img !== null && "src" in img);

	return (
		<div
			className={[
				isMobile
					? "flex items-center justify-center sm:h-[400px] md:h-[450px]"
					: "flex h-[350px] items-center justify-center sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flex h-full w-full items-center justify-center">
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
							<div className="flex items-center justify-center p-0">
								<Image
									src={image}
									alt={imageAlt || "Hero Offering"}
									className="h-[340px] w-[340px] rounded-xl object-contain sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px] lg:h-[700px] lg:w-[700px] xl:h-[800px] xl:w-[800px] 2xl:h-[900px] 2xl:w-[900px]"
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
					<SplineModel />
				)}
			</div>
		</div>
	);
};
