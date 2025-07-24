// Usage: For mobile-first image/text ordering, use this in a parent flex container with flex-col (mobile) and flex-row (desktop), placing the visual before <HeroCta /> for mobile.
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { toast } from "sonner";

export interface HeroCtaProps {
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
	className?: string;
}

/**
 * Hero CTA section: headline, badges, subheadline, and CTA (button or form).
 * No visual/3D/animated offering. Modular, DRY, and reusable.
 */
export const HeroCta: React.FC<HeroCtaProps> = ({
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
	className,
}) => {
	// Default CTA handler
	const handleTalkToSales = () => {
		toast.success("We'll contact you shortly!");
	};

	return (
		<div
			className={[
				"flex flex-col items-center justify-center md:pr-8 lg:items-start lg:pr-0",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{/* Badge */}
			<div className="mb-6 inline-flex w-fit items-center justify-center rounded-full border border-primary/20 bg-background-dark/70 px-4 py-1.5 backdrop-blur-md">
				<span className="mr-2 font-medium text-primary text-sm lg:text-base">
					{badgeLeft}
				</span>
				<div className="mx-1 h-0.5 w-2 rounded-full bg-primary/50" />
				<span className="ml-1 font-medium text-primary text-sm lg:text-base">
					{badgeRight}
				</span>
			</div>

			{/* Headline */}
			<h1 className="animate-fade-in text-center font-bold text-3xl text-glow sm:text-4xl lg:text-left lg:text-5xl xl:text-6xl 2xl:text-7xl">
				{headline}
			</h1>
			<span className="my-2 block bg-gradient-to-r from-primary to-focus bg-clip-text py-2 text-center font-bold text-3xl text-transparent sm:text-4xl lg:text-left lg:text-5xl xl:text-6xl 2xl:text-7xl">
				{highlight}
			</span>

			{/* Subheadline */}
			<p className="mb-6 max-w-md text-center text-base text-black sm:mb-10 sm:text-lg lg:max-w-xl lg:text-left lg:text-xl xl:max-w-2xl dark:text-white/70">
				{subheadline}
			</p>

			{/* CTA: Button(s) or custom form */}
			<div className="my-5 flex w-full max-w-md flex-col gap-4 sm:flex-row lg:max-w-xl">
				{ctaVariant === "form" && ctaForm ? (
					<div className="w-full">{ctaForm}</div>
				) : (
					<>
						<Button
							onClick={ctaOnClick || handleTalkToSales}
							className="glow mx-auto h-12 w-[70%] bg-gradient-to-r from-primary to-focus px-6 text-base text-black transition-opacity hover:opacity-90 sm:mx-0 sm:w-auto lg:h-14 lg:px-8 lg:text-lg dark:text-white"
						>
							{ctaLabel} <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
						</Button>
						{showLearnMore && (
							<Button
								variant="outline"
								className="mx-auto h-12 w-[70%] border-white/20 bg-white/5 px-6 text-base hover:bg-white/10 sm:mx-0 sm:w-auto lg:h-14 lg:px-8 lg:text-lg"
							>
								Learn More
							</Button>
						)}
					</>
				)}
			</div>
			{children}
		</div>
	);
};
