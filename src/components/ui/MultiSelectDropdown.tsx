import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

export interface MultiSelectOption {
	label: string;
	value: string;
	description?: string;
}

interface MultiSelectDropdownProps {
	options: MultiSelectOption[];
	value: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
	className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
	options,
	value,
	onChange,
	placeholder = "Select options",
	className = "",
}) => {
	const safeValue = Array.isArray(value)
		? value
		: value === undefined || value === null
			? []
			: (() => {
					console.warn(
						"[MultiSelectDropdown] Non-array value received:",
						value,
					);
					return [value].flat();
				})();
	if (!Array.isArray(value)) {
		console.warn("[MultiSelectDropdown] Coercing value to array:", value);
	}
	const handleChange = (next: unknown) => {
		if (!Array.isArray(next)) {
			console.warn(
				"[MultiSelectDropdown] onChange called with non-array:",
				next,
			);
			onChange([next].flat().filter((v): v is string => typeof v === "string"));
		} else {
			onChange(next.filter((v): v is string => typeof v === "string"));
		}
	};
	const [open, setOpen] = React.useState(false);

	const toggle = (val: string) => {
		const next = value.includes(val)
			? value.filter((v) => v !== val)
			: [...value, val];
		onChange(next);
	};

	return (
		<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
			<PopoverPrimitive.Trigger asChild>
				<button
					type="button"
					className={cn(
						"flex min-h-10 w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/40 bg-background px-3 py-2 font-medium text-foreground text-sm shadow-lg transition-colors placeholder:text-gray-400 focus:z-10 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-background-dark dark:text-white dark:focus:border-primary dark:focus:ring-primary dark:placeholder:text-white",
						className,
						value.length === 0 && "text-gray-400 dark:text-white",
					)}
				>
					{value.length === 0 ? (
						<span className="text-gray-400 dark:text-white/60">
							{placeholder}
						</span>
					) : (
						<div className="flex flex-wrap gap-1">
							{options
								.filter((opt) => value.includes(opt.value))
								.map((opt) => (
									<span
										key={opt.value}
										className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs dark:bg-primary/30 dark:text-primary-200"
									>
										{opt.label}
									</span>
								))}
						</div>
					)}
					<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</button>
			</PopoverPrimitive.Trigger>
			<PopoverPrimitive.Content
				align="start"
				sideOffset={4}
				className="z-50 mt-1 min-w-[var(--radix-popover-trigger-width)] max-w-lg rounded-lg border border-primary/40 bg-background p-1 text-foreground shadow-2xl ring-1 ring-primary/10 dark:border-white/30 dark:bg-background-dark dark:text-white dark:shadow-2xl dark:ring-white/10"
				style={{
					minWidth: "var(--radix-popover-trigger-width)",
				}}
			>
				<div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
					{options.map((opt) => (
						<div key={opt.value} className="mr-2 flex w-full items-center">
							<button
								type="button"
								onClick={() => toggle(opt.value)}
								className={cn(
									"flex w-full flex-1 cursor-pointer select-none items-center rounded-md px-2 py-2 text-left text-foreground text-sm transition-colors hover:bg-primary/20 focus:bg-primary/30 focus:text-primary-900 data-[disabled]:pointer-events-none data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary-900 data-[disabled]:opacity-50 dark:text-white dark:data-[state=checked]:bg-primary/40 dark:data-[state=checked]:text-primary-200 dark:focus:bg-primary/50 dark:focus:text-primary-200 dark:hover:bg-primary/40",
									value.includes(opt.value) &&
										"bg-primary/20 font-semibold dark:bg-primary/40",
								)}
							>
								<span className="mr-2 flex h-4 w-4 items-center justify-center">
									{value.includes(opt.value) && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</span>
								{opt.label}
							</button>
							{opt.description && (
								<button
									type="button"
									className="group relative rounded-full p-1 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-500 dark:hover:text-primary-200"
									tabIndex={0}
									aria-label="Show description"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Show description</title>
										<circle cx="12" cy="12" r="10" strokeWidth="2" />
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 16v-4m0-4h.01"
										/>
									</svg>
									<span className="pointer-events-none absolute top-6 right-0 z-50 hidden w-56 rounded-md border border-primary/20 bg-background p-2 text-foreground text-xs shadow-lg group-focus-within:block group-hover:block dark:border-white/20 dark:bg-background-dark dark:text-white">
										{opt.description}
									</span>
								</button>
							)}
						</div>
					))}
				</div>
			</PopoverPrimitive.Content>
		</PopoverPrimitive.Root>
	);
};

export default MultiSelectDropdown;
