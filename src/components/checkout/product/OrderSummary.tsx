import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { OrderSummaryProps } from "@/types/checkout";

export function OrderSummary({
	product,
	selection,
	subtotal,
	shipping,
	tax,
	total,
	discountedTotal,
	discountApplied,
	isLoading,
	error,
	onPay,
}: OrderSummaryProps) {
	const { type, color, size, quantity } = selection;
	const itemPrice =
		product.types?.find((t) => t?.value === type)?.price ?? product.price ?? 0;

	return (
		<div className="mt-8 space-y-6 md:mt-0">
			<h3 className="font-semibold text-lg">Order Summary</h3>

			{/* Product info */}
			<div className="flex items-start space-x-4 border-border border-b py-4">
				<div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
					{product.images?.[0] && (
						<img
							src={product.images[0]}
							alt={product.name}
							className="h-full w-full object-cover"
						/>
					)}
				</div>
				<div className="flex-1">
					<h4 className="font-medium">{product.name}</h4>
					{(type || color || size) && (
						<p className="text-muted-foreground text-sm">
							{type}
							{color && ` • ${color}`}
							{size && ` • ${size}`}
						</p>
					)}
					<p className="text-sm">Qty: {quantity}</p>
				</div>
				<p className="font-medium">${itemPrice.toFixed(2)}</p>
			</div>

			{/* Order total */}
			<div className="space-y-3">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Subtotal</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Shipping</span>
					<span>
						{shipping
							? `$${
									typeof shipping === "number"
										? shipping.toFixed(2)
										: shipping.amount.toFixed(2)
								}`
							: "Calculated"}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Tax</span>
					<span>${tax.toFixed(2)}</span>
				</div>
				<div className="flex items-center justify-between border-border border-t pt-4 font-semibold text-lg">
					<span>Total</span>
					{discountApplied ? (
						<div className="flex items-center">
							<span className="mr-2 text-gray-400 line-through dark:text-zinc-500">
								${total.toFixed(2)}
							</span>
							<span className="font-bold text-green-600 dark:text-green-400">
								${discountedTotal.toFixed(2)}
							</span>
						</div>
					) : (
						<span>${total.toFixed(2)}</span>
					)}
				</div>
			</div>
		</div>
	);
}
