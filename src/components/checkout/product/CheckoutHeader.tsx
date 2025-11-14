import type { CheckoutHeaderProps } from "@/types/checkout";
import { X } from "lucide-react";

export function CheckoutHeader({ onClose }: CheckoutHeaderProps) {
	return (
		<div className="sticky top-0 z-10 flex items-center justify-between border-border border-b bg-background p-6">
			<h2 className="font-bold text-2xl">Complete Your Order</h2>
			<button
				type="button"
				onClick={onClose}
				className="rounded-full p-2 transition-colors hover:bg-accent"
				aria-label="Close"
			>
				<X className="h-5 w-5" />
			</button>
		</div>
	);
}
