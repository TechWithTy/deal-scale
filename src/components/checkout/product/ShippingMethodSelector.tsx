import { cn } from "@/lib/utils";
import type { ShippingMethodSelectorProps } from "@/types/checkout";

export function ShippingMethodSelector({
	selectedShipping,
	onSelectShipping,
	shippingOptions,
}: ShippingMethodSelectorProps) {
	return (
		<div className="pt-4">
			<h3 className="mb-4 font-semibold text-lg">Shipping Method</h3>
			<div className="space-y-3">
				{shippingOptions.map((option) => (
					<button
						key={option.id}
						onClick={() => onSelectShipping(option)}
						type="button"
						className={cn(
							"w-full cursor-pointer rounded-lg border p-4 text-left transition-colors",
							selectedShipping?.id === option.id
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50",
						)}
					>
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">{option.label}</div>
								<div className="text-muted-foreground text-sm">
									{option.carrier.serviceLevel}
								</div>
							</div>
							<div className="font-medium">
								${option.price.amount.toFixed(2)}
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
