"use client";

import type { StaticImageData } from "next/image";
import type React from "react";
import { HeroOffering } from "../HeroOffering";
import { HeroCta } from "./HeroCta";

// * Props for Hero: all fields optional, defaults provided
export interface HeroProps {
	badgeLeft?: string;
	badgeRight?: string;
	headline?: string;
	subheadline?: string;
	highlight?: string;
	ctaLabel?: string;
	ctaOnClick?: () => void;
	ctaVariant?: "button" | "form";
	ctaForm?: React.ReactNode;
	showLearnMore?: boolean;
	children?: React.ReactNode;
	image?: string | StaticImageData | React.ReactNode; // Flexible: string, imported image, or node
	imageAlt?: string;
}

/**
 * Hero section with flexible content and CTA/form support.
 * Defaults to original values if props not provided.
 */
const Hero: React.FC<HeroProps> = ({
	badgeLeft = "AI Driven",
	badgeRight = "Future Proof MVPs",
	headline = "Launch with Confidence",
	subheadline = "Don't risk becoming another startup that loses $22,500-$48,000 on an MVP that breaks and bounces users. Instead, Scale Confidently and convert your investment into market dominance.",
	highlight = "Scale Seamlessly",
	ctaLabel = "Talk to Sales",
	ctaOnClick,
	ctaVariant = "button",
	ctaForm,
	showLearnMore = true,
	children,
	image,
	imageAlt,
}) => {
	return (
		<div className="relative flex flex-col overflow-hidden px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20 xl:px-12">
			<div className="absolute inset-0 bg-grid-lines opacity-20" />
			<div className="-translate-x-1/2 absolute top-1/4 left-1/2 h-[500px] w-[500px] rounded-full bg-glow-gradient blur-3xl lg:h-[700px] lg:w-[700px] xl:h-[900px] xl:w-[900px]" />
			<div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-6 pt-6 md:flex-row md:gap-10 xl:gap-16">
				{/* On mobile, image/model is first; on md+ screens, text is first */}
				<HeroOffering
					image={image}
					imageAlt={imageAlt}
					className="order-1 md:order-2"
				/>
				<HeroCta
					badgeLeft={badgeLeft}
					badgeRight={badgeRight}
					headline={headline}
					subheadline={subheadline}
					highlight={highlight}
					ctaLabel={ctaLabel}
					ctaOnClick={ctaOnClick}
					ctaVariant={ctaVariant}
					ctaForm={ctaForm}
					showLearnMore={showLearnMore}
					className="order-2 md:order-1"
				>
					{children}
				</HeroCta>
			</div>
		</div>
	);
};

export default Hero;
