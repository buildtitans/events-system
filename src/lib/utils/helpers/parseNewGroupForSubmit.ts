import { NewGroupInputSchema, NewGroupInputSchemaType } from "@/src/schemas/groupSchema";
import { createValidator } from "@/src/server/validation/validateSchema";

function parseNewGroupForSubmit(newGroup: unknown): NewGroupInputSchemaType {
    const NewGroupInputSchemaValidator = createValidator(NewGroupInputSchema, "NewGroupInputSchema")
    const validGroup = NewGroupInputSchemaValidator(newGroup)
    return validGroup
}

export { parseNewGroupForSubmit };