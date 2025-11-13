import { Loader2 } from "lucide-react";
import { useState } from "react";

import type { ProductActionsProps } from "./types";

const ProductActions = ({
	onAddToCart,
	onPurchase,
	isLoading,
	onBeforePurchase,
}: ProductActionsProps) => {
	const [isIntentPending, setIsIntentPending] = useState(false);

	const handlePurchase = async () => {
		if (isLoading || isIntentPending) return;
		try {
			setIsIntentPending(true);
			const proceed = await onBeforePurchase?.();
			if (proceed === false) {
				return;
			}
			onPurchase();
		} finally {
			setIsIntentPending(false);
		}
	};

	const isProcessing = isLoading || isIntentPending;

	return (
		<div className="mt-4 flex w-full gap-2">
			<button
				type="button"
				className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				onClick={onAddToCart}
			>
				<svg
					width="16"
					height="16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
					role="img"
					aria-labelledby="addToCartTitle"
				>
					<title id="addToCartTitle">Add to Cart</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				<span>Add to Cart</span>
			</button>
			<button
				type="button"
				className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
				onClick={handlePurchase}
				disabled={isProcessing}
				aria-live="assertive"
			>
				{isProcessing ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
						<span className="sr-only">Processing checkout…</span>
						<span aria-hidden>Processing…</span>
					</>
				) : (
					<>
						<svg
							width="16"
							height="16"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
							role="img"
							aria-labelledby="purchaseTitle"
						>
							<title id="purchaseTitle">Purchase</title>
							<circle cx="9" cy="21" r="1" />
							<circle cx="20" cy="21" r="1" />
							<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
						</svg>
						<span>Purchase</span>
					</>
				)}
			</button>
		</div>
	);
};

export default ProductActions;
