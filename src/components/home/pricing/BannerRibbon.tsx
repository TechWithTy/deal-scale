import { cn } from "@/lib/utils";
import type React from "react";

interface BannerRibbonProps {
	text: string;
	colorClassName?: string;
}

/**
 * BannerRibbon displays a diagonal promo ribbon (like ServiceCard) at the top right of a card.
 * - Use for pricing/plan banners (e.g., "Limited time: 50% off annual!")
 * - Use `colorClassName` for custom gradient or color
 */
export const BannerRibbon: React.FC<BannerRibbonProps> = ({
	text,
	colorClassName,
}) => (
	<div className="pointer-events-none absolute top-0 right-0 z-10 h-16 w-16 overflow-visible">
		<div
			className={cn(
				"absolute top-[32px] right-[-35px] w-[170px] rotate-45 transform py-1 text-center font-semibold text-white text-xs",
				colorClassName || "bg-gradient-to-r from-primary to-focus",
			)}
		>
			{text.split(" ").slice(0, 4).join(" ")}
		</div>
	</div>
);

export default BannerRibbon;
