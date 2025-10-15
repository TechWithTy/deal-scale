import type { ReactElement } from "react";

type SchemaNode = Record<string, unknown>;
type SchemaPayload = SchemaNode | SchemaNode[];

interface SchemaInjectorProps<TSchema extends SchemaPayload> {
        schema: TSchema;
}

export function SchemaInjector<TSchema extends SchemaPayload>({
        schema,
}: SchemaInjectorProps<TSchema>): ReactElement {
        const serializedSchema = JSON.stringify(schema);

        return (
                <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: serializedSchema }}
                />
        );
}
