"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const STAR_COUNT = 5;

interface TestimonialStarsProps {
	rating: number;
}

export function TestimonialStars({ rating }: TestimonialStarsProps) {
	return (
		<>
			{Array.from({ length: STAR_COUNT }, (_, index) => {
				const isFilled = index < rating;
				return (
					<Star
						key={`testimonial-star-${index}`}
						className={cn(
							"h-24 w-24 sm:h-6 sm:w-6 md:h-7 md:w-7",
							isFilled ? "fill-primary text-primary" : "text-gray-400",
							"transition-all duration-200",
						)}
						strokeWidth={2.5}
						fill={isFilled ? "currentColor" : "none"}
					/>
				);
			})}
		</>
	);
}
