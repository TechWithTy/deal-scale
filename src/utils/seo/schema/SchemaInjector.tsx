import type { ReactElement } from "react";

import { getServerSideJsonLd, type SchemaPayload } from "./server";

interface SchemaInjectorProps<TSchema extends SchemaPayload> {
        schema: TSchema;
}

export function SchemaInjector<TSchema extends SchemaPayload>({
        schema,
}: SchemaInjectorProps<TSchema>): ReactElement | null {
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
