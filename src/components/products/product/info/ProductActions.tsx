import { SocialShare } from "@/components/common/social/SocialShare";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, ShoppingCart } from "lucide-react";
import type { ProductType } from "@/types/products";
import { useCartStore } from "@/stores/useCartStore";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * * ProductActions: Purchase, add to cart, favorite, and share buttons
 */
export interface ProductActionsProps {
	onCheckout: () => void;
	checkoutLoading: boolean;
	stripeLoaded: boolean;
	ctaText?: string;
	product: ProductType;
	enableAddToCart?: boolean;
	variantId?: string;
}

export default function ProductActions({
	onCheckout,
	checkoutLoading,
	stripeLoaded,
	ctaText,
	product,
	enableAddToCart = true,
	variantId,
}: ProductActionsProps) {
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const { addItem } = useCartStore();

	// Get the first variant's AB test copy if available, otherwise use a default
	const abTestCopy =
		product.abTest?.variants[0]?.copy?.whatsInItForMe ||
		`Check out this ${product.name}`;

	const handleAddToCart = async () => {
		try {
			setIsAddingToCart(true);
			const selectedType = variantId
				? product.types?.find((t) => t.value === variantId)
				: undefined;

			addItem(
				{
					...product,
					price: selectedType?.price ?? product.price,
				},
				1, // Default quantity to 1
				selectedType
					? {
							id: selectedType.value,
							name: selectedType.name,
							price: selectedType.price,
							requiresShipping: true,
						}
					: undefined,
			);

			toast.success("Added to cart", {
				description: `${product.name}${selectedType ? ` (${selectedType.name})` : ""} has been added to your cart.`,
			});
		} catch (error) {
			console.error("Error adding to cart:", error);
			toast.error("Failed to add to cart", {
				description:
					"There was an error adding this item to your cart. Please try again.",
			});
		} finally {
			setIsAddingToCart(false);
		}
	};
	return (
		<>
			<div className="mt-10 flex flex-col gap-4">
				{enableAddToCart && (
					<div className="flex flex-col gap-4 sm:flex-row">
						<Button
							size="lg"
							className={cn(
								"flex-1 items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 font-medium text-base text-primary-foreground",
								"hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
								"transition-colors duration-200",
							)}
							onClick={onCheckout}
							disabled={checkoutLoading || !stripeLoaded}
						>
							{checkoutLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								ctaText || "Checkout"
							)}
						</Button>

						<Button
							variant="secondary"
							size="lg"
							className={cn(
								"flex-1 items-center justify-center rounded-md px-8 py-3 font-normal text-base",
								"border border-input bg-secondary text-secondary-foreground hover:bg-secondary/80",
								"transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
							)}
							onClick={handleAddToCart}
							disabled={isAddingToCart}
						>
							{isAddingToCart ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Adding...
								</>
							) : (
								<>
									<ShoppingCart className="mr-2 h-5 w-5" />
									Add to Cart
								</>
							)}
						</Button>

						{process.env.NEXT_PUBLIC_APP_MODE === "hybrid" && (
							<Button
								variant="outline"
								size="lg"
								className={cn(
									"flex items-center justify-center rounded-md border border-input bg-background px-3 py-3 text-muted-foreground transition-colors hover:bg-muted/60",
									"dark:border-card dark:bg-card dark:text-muted-foreground dark:hover:bg-muted/50",
								)}
							>
								<Heart className="h-6 w-6" />
								<span className="sr-only">Add to favorites</span>
							</Button>
						)}
					</div>
				)}

				{!enableAddToCart && (
					<Button
						size="lg"
						variant={enableAddToCart ? "outline" : "default"}
						className={cn(
							"flex w-full items-center justify-center rounded-md border font-medium",
							enableAddToCart
								? "border-input bg-background text-foreground hover:bg-muted/60"
								: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
							"px-8 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
						)}
						onClick={onCheckout}
						disabled={checkoutLoading || !stripeLoaded}
					>
						{checkoutLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							ctaText || "Checkout"
						)}
					</Button>
				)}
			</div>
			<div className="my-6">
				<SocialShare
					showLabels
					size="sm"
					variant="ghost"
					className="text-muted-foreground hover:text-foreground"
					defaultShareText={abTestCopy}
				/>
			</div>
		</>
	);
}
