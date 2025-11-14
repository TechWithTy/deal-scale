import { cn } from "@/lib/utils";
import type { Review } from "@/types/products";
import { Star } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

/**
 * * ProductStars: Renders star rating and review count
 * @param {number} rating
 * @param {number} reviewCount
 */
interface ProductStarsProps {
	rating: number;
	reviewCount: number;
	setActiveTab?: (tab: string) => void;
}

export default function ProductStars({
	rating,
	reviewCount,
	setActiveTab,
}: ProductStarsProps) {
	return (
		<div className="mt-3">
			<h3 className="sr-only">Reviews</h3>
			<div className="flex items-center">
				<div className="flex items-center">
					{Array.from({ length: 5 }, (_, i) => (
						<Star
							key={uuidv4()}
							className={cn(
								"h-5 w-5",
								i < Math.round(rating)
									? "fill-current text-yellow-400 dark:text-yellow-300"
									: "text-muted",
							)}
						/>
					))}
				</div>
				<p className="sr-only">{rating} out of 5 stars</p>
				{reviewCount > 0 && (
					<button
						type="button"
						className="ml-3 font-medium text-primary text-sm hover:text-primary/80 dark:text-primary dark:hover:text-primary/70"
						aria-label="Show reviews tab"
						onClick={() => setActiveTab?.("reviews")}
					>
						{reviewCount} review{reviewCount === 1 ? "" : "s"}
					</button>
				)}
			</div>
		</div>
	);
}
