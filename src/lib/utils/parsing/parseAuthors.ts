import type { AuthorsSchemaType } from "@/src/schemas/eventSchema";

function parseAuthors(value: unknown): value is AuthorsSchemaType {
    return (
        Array.isArray(value) &&
        value.every(
            (a) =>
                a &&
                typeof a === "object" &&
                typeof (a as any).name === "string" &&
                typeof (a as any).avatar === "string"
        )
    );
}

export { parseAuthors };