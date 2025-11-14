"use client";
import * as React from "react";

export type LinkCardBodyProps = {
	title: string;
	description?: string;
	details?: string;
};

export function LinkCardBody({
	title,
	description,
	details,
}: LinkCardBodyProps) {
	const needsToggle = Boolean(
		details && (details.length > 80 || /\n/.test(details)),
	);
	const [expanded, setExpanded] = React.useState(false);

	return (
		<div className="min-w-0 flex-1">
			<div className="truncate font-medium">{title}</div>
			{needsToggle ? (
				<button
					type="button"
					className="truncate text-muted-foreground text-sm underline-offset-2 hover:underline"
					aria-expanded={expanded}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setExpanded((v) => !v);
					}}
				>
					{expanded ? "Hide details" : (description ?? "Show details")}
				</button>
			) : (
				<>
					{description ? (
						<div className="truncate text-muted-foreground text-sm">
							{description}
						</div>
					) : null}
					{details ? (
						<div className="mt-0.5 truncate text-muted-foreground text-sm">
							{details}
						</div>
					) : null}
				</>
			)}
			{details && expanded ? (
				<div className="mt-1 whitespace-pre-wrap text-muted-foreground text-xs">
					{details}
				</div>
			) : null}
		</div>
	);
}
