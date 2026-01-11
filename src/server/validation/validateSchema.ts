import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { TSchema } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";
import { AuthorsSchema, EventsArraySchema } from "@/src/schemas/eventSchema";
import { LayoutSlotSchemaArray } from "@/src/schemas/layoutSlotSchema";

export function createValidator<T extends TSchema>(schema: T) {
    const compiled = TypeCompiler.Compile(schema);

    return (data: unknown): Static<T> => {
        if (!compiled.Check(data)) {
            const errors = [...compiled.Errors(data)].map(err => ({
                path: err.path,
                message: err.message,
                value: err.value,
            }));

            throw new Error(
                "Schema validation failed:\n" +
                JSON.stringify(errors, null, 2)
            );
        }

        return data as Static<T>;
    };
}

const eventsValidator = createValidator(EventsArraySchema);

const layoutSlotValidator = createValidator(LayoutSlotSchemaArray);


const AuthorsValidator = TypeCompiler.Compile(AuthorsSchema);


export { AuthorsValidator, eventsValidator, layoutSlotValidator };
