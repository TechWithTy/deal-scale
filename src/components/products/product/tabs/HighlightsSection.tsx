import { v4 as uuid } from "uuid";
import { cn } from "@/lib/utils";

interface HighlightsSectionProps {
	highlights: string[];
}

const HighlightsSection = ({ highlights }: HighlightsSectionProps) => (
	<section
		className={cn(
			"my-8 rounded-lg p-6 transition-colors",
			// Light mode
			"border border-border/50 bg-card/50 shadow-sm",
			// Dark mode
			"dark:border-muted/30 dark:bg-muted/20",
		)}
	>
		<h3 className="mb-4 font-semibold text-lg text-neutral-900 dark:text-primary">
			Key Features
		</h3>
		<ul className="space-y-3 pl-5">
			{highlights.map((highlight) => (
				<li
					key={uuid()}
					className={cn(
						"relative pl-5",
						"text-neutral-800 dark:text-muted-foreground",
						"before:absolute before:top-2.5 before:left-0",
						"before:h-1.5 before:w-1.5 before:rounded-full",
						"before:bg-primary/80 dark:before:bg-primary/90",
					)}
				>
					{highlight}
				</li>
			))}
		</ul>
	</section>
);

export default HighlightsSection;
