import type { AuthorsSchemaType } from "@/src/schemas/eventSchema";

function parseAuthors(
    value: unknown
): value is AuthorsSchemaType {

    return (
        Array.isArray(value) &&
        value.every(
            (a) =>
                a &&
                typeof a === "object" &&
                typeof (a).name === "string" &&
                typeof (a).avatar === "string"
        )
    );
}

export { parseAuthors };