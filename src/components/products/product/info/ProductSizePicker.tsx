import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProductSelection } from "@/contexts/ProductSelectionContext";
import { sizingChart } from "@/data/products/sizingChart";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/products";
import { v4 as uuid } from "uuid";

/**
 * * ProductSizePicker: Size selection radio group
 */
export default function ProductSizePicker({
	product,
}: {
	product: ProductType;
}) {
	const { selection, setSelection } = useProductSelection();

	if (!product.sizes || product.sizes.length === 0) return null;
	return (
		<div className="mt-8">
			<div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between">
				<h3 className="font-medium text-primary text-sm">Size</h3>
				{/* ! Size guide modal trigger */}
				<Dialog>
					<DialogTrigger asChild>
						<button
							type="button"
							className="text-primary text-sm underline hover:text-primary/80 focus:outline-none"
							aria-label="Open size guide"
						>
							Size guide
						</button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Size Guide</DialogTitle>
						</DialogHeader>
						{/* * Sizing chart table */}
						<div className="mt-4 overflow-x-auto">
							<table className="min-w-full border text-sm">
								<thead>
									<tr>
										<th className="border px-3 py-2 text-left">Label</th>
										<th className="border px-3 py-2 text-left">Value</th>
										<th className="border px-3 py-2 text-left">Measurement</th>
										<th className="border px-3 py-2 text-left">Unit</th>
									</tr>
								</thead>
								<tbody>
									{sizingChart.map((row) => (
										<tr key={uuid()}>
											<td className="border px-3 py-2">{row.label}</td>
											<td className="border px-3 py-2">{row.value}</td>
											<td className="border px-3 py-2">{row.measurement}</td>
											<td className="border px-3 py-2">{row.unit}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<RadioGroup
				value={selection.size}
				onValueChange={(value) => setSelection({ size: value })}
				className="mt-2"
			>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
					{product.sizes.map((size) => (
						<div key={size.value}>
							<RadioGroupItem
								value={size.value}
								id={`size-${size.value}`}
								disabled={!size.inStock}
								className="sr-only"
							/>
							<Label
								htmlFor={`size-${size.value}`}
								className={cn(
									"flex w-full cursor-pointer items-center justify-center rounded-md border border-card bg-muted px-0 py-3 font-semibold text-base text-primary shadow-sm transition-colors hover:bg-background-darker focus:outline-none sm:px-2 sm:py-4 dark:border-card dark:bg-muted/60 dark:text-primary dark:hover:bg-background-darker",
									selection.size === size.value
										? "border-primary bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
										: "",
								)}
							>
								{size.name}
							</Label>
						</div>
					))}
				</div>
			</RadioGroup>
		</div>
	);
}
