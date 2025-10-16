import type { ReactElement } from "react";

import { getServerSideJsonLd, type SchemaPayload } from "./server";

interface SchemaInjectorProps<TSchema extends SchemaPayload> {
        schema: TSchema;
}

export function SchemaInjector<TSchema extends SchemaPayload>({
        schema,
}: SchemaInjectorProps<TSchema>): ReactElement | null {
        const result = getServerSideJsonLd({ schema });

        if (!result.ok) {
                if (process.env.NODE_ENV !== "production") {
                        console.error("Failed to render JSON-LD schema", result.error);
                }

                return null;
        }

        return (
                <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: result.json }}
                />
        );
}
