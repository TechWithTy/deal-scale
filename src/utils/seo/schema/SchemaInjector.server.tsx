import "server-only";

import type { ReactElement } from "react";

import { type SchemaPayload, getServerSideJsonLd } from "./server";

interface SchemaInjectorProps<TSchema extends SchemaPayload> {
	schema: TSchema;
}

export function SchemaInjector<TSchema extends SchemaPayload>({
	schema,
}: SchemaInjectorProps<TSchema>): ReactElement | null {
	const isJestEnvironment =
		process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined;

	if (typeof window !== "undefined" && !isJestEnvironment) {
		throw new Error("SchemaInjector must be rendered on the server only.");
	}

	const result = getServerSideJsonLd({ schema });

	if (result.ok) {
		return (
			<script
				suppressHydrationWarning
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: result.json }}
			/>
		);
	}

	if (process.env.NODE_ENV !== "production") {
		if ("error" in result) {
			console.error("Failed to render JSON-LD schema", result.error);
		} else {
			console.error("Failed to render JSON-LD schema");
		}
	}

	return null;
}
