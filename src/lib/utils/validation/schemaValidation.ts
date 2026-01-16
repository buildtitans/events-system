import { TypeCompiler } from "@sinclair/typebox/compiler";
import { NewGroupInputSchema } from "@/src/schemas/groupSchema";

const NewGroupInputSchemaValidator = TypeCompiler.Compile(NewGroupInputSchema);

export { NewGroupInputSchemaValidator };