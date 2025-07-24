import { cn } from "@/lib/utils";
import type { Review } from "@/types/products";
import { Star } from "lucide-react";
import { v4 as uuid } from "uuid";

interface ReviewsTabContentProps {
	reviews: Review[];
}

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

const ReviewsTabContent = ({ reviews }: ReviewsTabContentProps) => (
	<div className="space-y-6">
		<h3 className="font-medium text-lg text-primary">Customer Reviews</h3>
		{reviews.map((review) => (
			<div key={review.id} className="border-card border-b pb-6">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h4 className="font-medium text-primary">{review.author}</h4>
						<div className="mt-1 flex items-center">
							{renderStars(review.rating)}
						</div>
					</div>
					<span className="text-primary text-sm">{review.date}</span>
				</div>
				<p className="text-muted-foreground">{review.content}</p>
			</div>
		))}
	</div>
);

export default ReviewsTabContent;
