/**
 * * getAverageRating: Utility to calculate average rating from reviews
 */
import type { Review } from "@/types/products";
export default function getAverageRating(reviews: Review[]): number {
	if (!reviews || !reviews.length) return 0;
	const total = reviews.reduce((sum, r) => sum + r.rating, 0);
	return Math.round((total / reviews.length) * 10) / 10;
}
