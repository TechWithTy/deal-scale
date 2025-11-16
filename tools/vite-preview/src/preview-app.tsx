import React from "react";
import Link from "next/link";

/**
 * Minimal preview surface for validating shared UI components under Vite.
 * Replace the placeholder content with imports from src/components as teams
 * adopt the Vite pipeline.
 */
const PreviewApp: React.FC = () => {
	return (
		<div className="min-h-screen bg-background text-foreground px-6 py-12">
			<div className="mx-auto max-w-4xl space-y-4">
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight">
						DealScale Vite Preview
					</h1>
					<p className="text-muted-foreground">
						This environment bootstraps shared components using the experimental
						Vite pipeline. Enable new scenarios by importing from{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-sm">@</code>.
					</p>
				</header>
				<section className="rounded-lg border border-border bg-card/80 p-6 shadow-lg backdrop-blur">
					<h2 className="text-xl font-medium">Next steps</h2>
					<ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
						<li>Import shared UI components to validate HMR and theming.</li>
						<li>
							Dial in data adapters by mocking server-only utilities under{" "}
							<code className="rounded bg-muted px-1 py-0.5 text-sm">
								tools/vite-preview/src/shims
							</code>
							.
						</li>
						<li>
							Update the{" "}
							<Link
								className="font-semibold text-primary underline-offset-2 hover:underline"
								href="https://rspack.rs/guide/start/quick-start#migrating-from-existing-projects"
								target="_blank"
								rel="noreferrer"
							>
								forward-compatibility docs
							</Link>{" "}
							with learnings.
						</li>
					</ul>
				</section>
			</div>
		</div>
	);
};

export default PreviewApp;


