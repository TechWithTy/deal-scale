import { memo } from "react";

import { cn } from "@/lib/utils";

export interface ScrollProgressSection {
	readonly id: string;
	readonly label: string;
}

interface ScrollProgressIndicatorProps {
	readonly sections: readonly ScrollProgressSection[];
	readonly activeId: string;
}

function ScrollProgressIndicatorComponent({
	sections,
	activeId,
}: ScrollProgressIndicatorProps): JSX.Element {
	return (
		<nav className="flex items-center gap-3 rounded-full border border-border/50 bg-background/70 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-muted-foreground backdrop-blur-md shadow-[0_12px_40px_-30px_rgba(15,118,110,0.45)]">
			{sections.map((section, index) => {
				const isActive = section.id === activeId;
				return (
					<div
						key={section.id}
						className="flex items-center gap-3"
						aria-current={isActive ? "step" : undefined}
					>
						<div className="flex items-center gap-2">
							<span
								className={cn(
									"size-2 rounded-full transition-colors",
									isActive ? "bg-primary" : "bg-border/70",
								)}
							/>
							<span
								className={cn(
									"font-semibold transition-colors",
									isActive ? "text-foreground" : "text-muted-foreground/80",
								)}
							>
								{section.label}
							</span>
						</div>
						{index < sections.length - 1 ? (
							<span className="h-2 w-px bg-border/40" aria-hidden="true" />
						) : null}
					</div>
				);
			})}
		</nav>
	);
}

export const ScrollProgressIndicator = memo(ScrollProgressIndicatorComponent);
