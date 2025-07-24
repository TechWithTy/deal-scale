import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProductSelection } from "@/contexts/ProductSelectionContext";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/products";

/**
 * * ProductTypePicker: Type selection radio group
 */
export default function ProductTypePicker({
	product,
}: {
	product: ProductType;
}) {
	const { selection, setSelection } = useProductSelection();

	if (!product.types || product.types.length === 0) return null;
	return (
		<div>
			<h3 className="font-medium text-primary text-sm">Type</h3>
			<RadioGroup
				value={selection.type}
				onValueChange={(value) => setSelection({ type: value })}
				className="mt-2"
			>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{product.types.map((type) => (
						<div key={type.value}>
							<RadioGroupItem
								value={type.value}
								id={`type-${type.value}`}
								className="sr-only cursor-pointer"
							/>
							<Label
								htmlFor={`type-${type.value}`}
								className={cn(
									"flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-card bg-muted px-4 py-4 font-semibold text-lg text-primary shadow-sm transition-colors hover:bg-background-darker focus:outline-none sm:px-8 sm:py-6 dark:border-card dark:bg-muted/60 dark:text-primary dark:hover:bg-background-darker",
									selection.type === type.value
										? "border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
										: "",
								)}
							>
								<span className="font-medium">{type.name}</span>
								<span className="mt-1 text-muted-foreground text-xs">
									${type.price.toFixed(2)}
								</span>
							</Label>
						</div>
					))}
				</div>
			</RadioGroup>
		</div>
	);
}
