import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProductSelection } from "@/contexts/ProductSelectionContext";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/products";

/**
 * * ProductColorPicker: Color selection radio group
 */
export default function ProductColorPicker({
	product,
}: {
	product: ProductType;
}) {
	const { selection, setSelection } = useProductSelection();

	if (!product.colors || product.colors.length === 0) return null;
	return (
		<div className="mt-8">
			<h3 className="font-medium text-primary text-sm">Color</h3>
			<RadioGroup
				value={selection.color}
				onValueChange={(value) => setSelection({ color: value })}
				className="mt-2"
			>
				<div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
					{product.colors.map((color) => (
						<div key={color.value} className="flex items-center">
							<RadioGroupItem
								value={color.value}
								id={`color-${color.value}`}
								className="sr-only"
							/>
							<Label
								htmlFor={`color-${color.value}`}
								className={cn(
									"-m-0.5 relative flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-shadow focus:outline-none",
									selection.color === color.value
										? "ring-2 ring-primary ring-offset-2 ring-offset-background"
										: "",
								)}
							>
								<span className="sr-only">{color.name}</span>
								<span
									className={cn(
										"h-8 w-8 rounded-full border border-accent border-opacity-10 dark:border-accent dark:border-opacity-10",
										color.class,
									)}
								/>
							</Label>
						</div>
					))}
				</div>
			</RadioGroup>
		</div>
	);
}
