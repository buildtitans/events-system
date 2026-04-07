import { createValidator } from "@/src/shared/utils/validation/validateSchema";
import { Static, TSchema } from "@sinclair/typebox";

export function parseInputSchema<T extends TSchema>(data: unknown, schema: T): Static<T> {

    const parser = createValidator(schema);

    const parsed = parser(data);


    return parsed;
}
