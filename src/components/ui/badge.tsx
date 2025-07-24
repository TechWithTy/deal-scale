import { cn } from "@/lib/utils";
import type * as React from "react";
import { badgeVariants } from "./badge-variants";
import type { BadgeVariants } from "./badge-variants";

interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		BadgeVariants {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
};

export { Badge };
