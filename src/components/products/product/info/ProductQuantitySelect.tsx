"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductSelection } from "@/contexts/ProductSelectionContext";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Touch-friendly minimum target size (44x44px as per WCAG)
const TOUCH_TARGET_SIZE =
	"min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]";

export default function ProductQuantitySelect({
	max = 10,
	min = 1,
	className,
	onQuantityChange,
}: {
	max?: number;
	min?: number;
	className?: string;
	onQuantityChange?: (quantity: number) => void;
}) {
	const { selection, setSelection } = useProductSelection();
	const [quantity, setQuantity] = useState<number>(selection.quantity || min);
	const inputRef = useRef<HTMLInputElement>(null);
	const [isInvalid, setIsInvalid] = useState(false);

	// Sync with selection context
	useEffect(() => {
		setQuantity((prev) => selection.quantity || min);
	}, [selection.quantity, min]);

	// Callback for external changes
	useEffect(() => {
		onQuantityChange?.(quantity);
	}, [quantity, onQuantityChange]);

	const updateQuantity = (newQuantity: number) => {
		// Ensure quantity stays within bounds
		const validatedQuantity = Math.max(min, Math.min(max, newQuantity));
		setSelection({ quantity: validatedQuantity });
		setQuantity(validatedQuantity);
		setIsInvalid(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const numValue = Number.parseInt(value, 10);

		// Allow empty input for better UX when deleting numbers
		if (value === "") {
			setQuantity(Number.NaN);
			return;
		}

		if (Number.isNaN(numValue) || numValue < min || numValue > max) {
			setIsInvalid(true);
			return;
		}

		updateQuantity(numValue);
	};

	const handleBlur = () => {
		if (Number.isNaN(quantity) || quantity < min) {
			updateQuantity(min);
		} else if (quantity > max) {
			updateQuantity(max);
		}
	};

	const increment = () => updateQuantity(quantity + 1);
	const decrement = () => updateQuantity(quantity - 1);

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			increment();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			decrement();
		}
	};

	return (
		<div className={cn("my-5 w-full", className)}>
			<div className="mb-2 flex items-center justify-between">
				<h3 className="font-medium text-primary text-sm">Quantity</h3>
			</div>
			<div className="flex w-full justify-center">
				<Button
					type="button"
					variant="outline"
					size="icon"
					className={cn(
						TOUCH_TARGET_SIZE,
						"rounded-r-none border-r-0 transition-colors duration-200",
						"hover:bg-gray-100 active:bg-gray-200",
						"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						quantity <= min && "cursor-not-allowed opacity-50",
					)}
					onClick={decrement}
					disabled={quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" />
				</Button>

				<div className="relative">
					<Input
						id="quantity-selector"
						ref={inputRef}
						type="number"
						min={min}
						max={max}
						value={Number.isNaN(quantity) ? "" : quantity}
						onChange={handleInputChange}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						aria-invalid={isInvalid}
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuenow={Number.isNaN(quantity) ? min : quantity}
						className={cn(
							"h-auto w-16 rounded-none border-x-0 py-2 text-center font-medium text-base",
							"[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
							"focus-visible:ring-2 focus-visible:ring-ring",
							isInvalid && "border-red-500 focus-visible:ring-red-200",
						)}
					/>
					{isInvalid && (
						<div className="-bottom-6 absolute right-0 left-0 text-center text-red-500 text-xs">
							Must be {min}-{max}
						</div>
					)}
				</div>

				<Button
					type="button"
					variant="outline"
					size="icon"
					className={cn(
						TOUCH_TARGET_SIZE,
						"rounded-l-none border-l-0 transition-colors duration-200",
						"hover:bg-gray-100 active:bg-gray-200",
						"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						quantity >= max && "cursor-not-allowed opacity-50",
					)}
					onClick={increment}
					disabled={quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
