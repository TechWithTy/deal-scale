import type { DiscountCodeInputProps } from "@/types/checkout";
import { Loader2 } from "lucide-react";

export function DiscountCodeInput({
	discountCode,
	setDiscountCode,
	discountApplied,
	discountError,
	checkingDiscount,
	onCheckDiscount,
}: DiscountCodeInputProps) {
	return (
		<div className="space-y-2 pb-2">
			<label
				htmlFor="discount"
				className="block font-semibold text-black dark:text-zinc-100"
			>
				Discount Code
			</label>
			<div className="flex gap-2">
				<input
					id="discount"
					type="text"
					placeholder="Enter code (if any)"
					value={discountCode}
					onChange={(e) => setDiscountCode(e.target.value)}
					className="flex-1 rounded border border-zinc-200 bg-white px-3 py-2 text-black transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500 dark:placeholder:text-zinc-500"
					disabled={!!discountApplied}
					autoComplete="off"
				/>
				<button
					type="button"
					className="rounded bg-focus px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/80 dark:bg-blue-700 dark:hover:bg-blue-600"
					onClick={onCheckDiscount}
					disabled={checkingDiscount || !!discountApplied || !discountCode}
				>
					{discountApplied ? (
						"Applied"
					) : checkingDiscount ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						"Apply"
					)}
				</button>
			</div>
			{discountError && (
				<p className="mt-1 text-red-600 text-xs dark:text-red-400">
					{discountError}
				</p>
			)}
			{discountApplied && (
				<div className="mt-1 flex items-center gap-2 text-green-600 text-xs dark:text-green-400">
					<span>
						Discount <b>{discountApplied.code}</b> applied!
					</span>
					{discountApplied.discountPercent && (
						<span>({discountApplied.discountPercent}% off)</span>
					)}
					{discountApplied.discountAmount && (
						<span>
							(${(discountApplied.discountAmount / 100).toFixed(2)} off)
						</span>
					)}
					{discountApplied.expires && (
						<span>
							Expires: {new Date(discountApplied.expires).toLocaleDateString()}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
