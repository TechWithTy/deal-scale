import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LicenseType, Review } from "@/types/products";
import type { ShippingTimeEstimate } from "@/types/products/shipping";
import type { ABTestCopy } from "@/types/testing";
import { Star } from "lucide-react";
import { v4 as uuid } from "uuid";
import DetailsTabContent from "./tabs/DetailsTabContent";
import FaqTabContent from "./tabs/FaqTabContent";
import ReviewsTabContent from "./tabs/ReviewsTabContent";

interface FAQ {
	question: string;
	answer: string;
}

interface ProductTabsProps {
	value: string;
	onValueChange: (tab: string) => void;
	description: string;
	highlights: string[];
	shipping?: ShippingTimeEstimate;
	reviews: Review[];
	faqs: FAQ[];
	licenseName?: LicenseType; // Optional prop to select license by name
	abTestCopy?: ABTestCopy; // Optional AB test copy
}

// * Presentational component: Next.js compatible, no navigation or SSR logic
import { useEffect, useRef } from "react";

const ProductTabs = ({
	description,
	highlights,
	shipping,
	reviews,
	faqs,
	licenseName,
	abTestCopy,
	value,
	onValueChange,
}: ProductTabsProps) => {
	const prevTab = useRef<string>(value);
	useEffect(() => {
		if (value === "reviews" && prevTab.current !== "reviews") {
			const el = document.getElementById("reviews");
			if (el) {
				el.scrollIntoView({ behavior: "smooth" });
			}
		}
		prevTab.current = value;
	}, [value]);
	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={uuid()}
				className={cn(
					"h-4 w-4",
					i < rating ? "fill-current text-yellow-400" : "text-muted",
				)}
			/>
		));
	};

	return (
		<Tabs value={value} onValueChange={onValueChange} className="w-full">
			<TabsList className="flex w-full">
				<TabsTrigger className="flex-1" value="details">
					Details
				</TabsTrigger>
				{reviews.length > 0 && (
					<TabsTrigger className="flex-1" value="reviews">
						Reviews
					</TabsTrigger>
				)}
				<TabsTrigger className="flex-1" value="faq">
					FAQ
				</TabsTrigger>
			</TabsList>

			<TabsContent value="details" className="mt-8">
				<DetailsTabContent
					description={description}
					abTestCopy={abTestCopy}
					licenseName={licenseName}
					highlights={highlights}
					shipping={shipping}
				/>
			</TabsContent>

			{reviews.length > 0 && (
				<TabsContent value="reviews" className="mt-8" id="reviews">
					<ReviewsTabContent reviews={reviews} />
				</TabsContent>
			)}

			<TabsContent value="faq" className="mt-8">
				<FaqTabContent faqs={faqs} />
			</TabsContent>
		</Tabs>
	);
};

export default ProductTabs;
