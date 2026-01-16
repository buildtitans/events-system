import { NewGroupInputSchemaValidator } from "@/src/lib/utils/validation/schemaValidation";

function validateNewGroupInput(newGroup: unknown): boolean {
    const validated = NewGroupInputSchemaValidator.Check(newGroup);

    return validated
};

export { validateNewGroupInput }