import type { HeroGridItem } from "@/data/products/hero";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/products";

interface ProductGridItemProps {
	item: HeroGridItem;
	categories: ProductCategory[];
	onCategorySelect: (categoryId: string) => void;
	className?: string;
	isLarge?: boolean;
}

export const ProductGridItem = ({
	item,
	categories,
	onCategorySelect,
	className,
	isLarge = false,
}: ProductGridItemProps) => {
	const { categoryId, label, description, src, alt, ariaLabel } = item;
	const categoryExists = categories.some((c) => c === categoryId);

	const handleClick = () => {
		if (categoryExists) {
			onCategorySelect(categoryId);
		} else {
			toast({
				title: "Category not available",
				description: `The category "${label}" is not currently available.`,
				variant: "destructive",
			});
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"group relative overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus",
				isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1",
				"glow glow-hover cursor-pointer",
				className,
			)}
			aria-label={ariaLabel || label}
			disabled={!categoryExists}
			aria-disabled={!categoryExists}
		>
			<img
				src={src}
				alt={alt}
				className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				draggable={false}
				loading="lazy"
			/>
			<div className="absolute inset-0 flex items-end bg-gradient-to-t from-background-dark/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				<div className="text-left">
					<h3
						className={cn(
							"mb-1 font-bold text-xl",
							categoryExists
								? "underline [text-shadow:1px_1px_0_black,0_1px_0_black,1px_0_0_black] hover:text-accent"
								: "text-muted-foreground",
						)}
						title={
							categoryExists ? `Filter by ${label}` : `Coming soon: ${label}`
						}
					>
						{label}
					</h3>
					{description && (
						<p className="text-white/90 text-xs [text-shadow:1px_1px_0_black,0_1px_0_black,1px_0_0_black]">
							{description}
						</p>
					)}
				</div>
			</div>
		</button>
	);
};
