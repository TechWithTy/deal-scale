export type SchemaNode = Record<string, unknown>;
export type SchemaPayload = SchemaNode | SchemaNode[];

type SchemaBuilder<TInput, TSchema extends SchemaPayload> = (
        input: TInput,
) => TSchema;

export type ServerSideJsonLdSuccess<TSchema extends SchemaPayload> = {
        ok: true;
        json: string;
        schema: TSchema;
};

export type ServerSideJsonLdError = {
        ok: false;
        error: Error;
};

export type ServerSideJsonLdResult<TSchema extends SchemaPayload> =
        | ServerSideJsonLdSuccess<TSchema>
        | ServerSideJsonLdError;

function sanitizeJsonLd(serialized: string): string {
        return serialized
                .replace(/</g, "\\u003C")
                .replace(/>/g, "\\u003E")
                .replace(/&/g, "\\u0026")
                .replace(/\u2028/g, "\\u2028")
                .replace(/\u2029/g, "\\u2029");
}

function normalizeError(error: unknown): Error {
        if (error instanceof Error) return error;
        return new Error(typeof error === "string" ? error : "Unknown schema serialization error");
}

export function getServerSideJsonLd<TSchema extends SchemaPayload, TInput>(
        options: { builder: SchemaBuilder<TInput, TSchema>; input: TInput },
): ServerSideJsonLdResult<TSchema>;
export function getServerSideJsonLd<TSchema extends SchemaPayload>(
        options: { schema: TSchema },
): ServerSideJsonLdResult<TSchema>;
export function getServerSideJsonLd<TSchema extends SchemaPayload, TInput>(
        options:
                | { builder: SchemaBuilder<TInput, TSchema>; input: TInput }
                | { schema: TSchema },
): ServerSideJsonLdResult<TSchema> {
        try {
                const schema = "builder" in options
                        ? options.builder(options.input)
                        : options.schema;

                if (schema === undefined || schema === null) {
                        throw new Error("Schema builder returned nullish result");
                }

                const json = sanitizeJsonLd(JSON.stringify(schema));

                return {
                        ok: true,
                        json,
                        schema,
                };
        } catch (error) {
                return {
                        ok: false,
                        error: normalizeError(error),
                };
        }
}
