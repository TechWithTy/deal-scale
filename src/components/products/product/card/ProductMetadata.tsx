import { v4 as uuid } from "uuid";
import type { ProductMetadataProps } from "./types";

const ProductMetadata = ({ price, reviews = [] }: ProductMetadataProps) => {
	const hasReviews = reviews.length > 0;
	const averageRating = hasReviews
		? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
		: 0;

	return (
		<div className="mt-2">
			{hasReviews && (
				<div className="mb-2 flex items-center gap-1 text-base">
					<span className="flex gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<svg
								key={uuid()}
								width="16"
								height="16"
								fill={i < Math.round(averageRating) ? "#facc15" : "#e5e7eb"}
								viewBox="0 0 20 20"
								role="img"
								aria-label={`${i + 1} out of 5 stars`}
							>
								<title>{`${i + 1} out of 5 stars`}</title>
								<polygon points="10,1.5 12.59,7.36 19,7.97 14,12.26 15.18,18.5 10,15.27 4.82,18.5 6,12.26 1,7.97 7.41,7.36" />
							</svg>
						))}
					</span>
					<span className="ml-1 font-semibold text-black dark:text-white">
						{averageRating.toFixed(1)}
					</span>
					<span className="text-gray-500 text-sm dark:text-gray-300">
						({reviews.length.toLocaleString()})
					</span>
				</div>
			)}
			<div className="text-center font-bold text-2xl text-black dark:text-white">
				${price.toLocaleString()}
			</div>
		</div>
	);
};

export default ProductMetadata;
