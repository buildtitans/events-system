import { TypeCompiler } from "@sinclair/typebox/compiler";
import { NewGroupInputSchema } from "@/src/schemas/groups/groupSchema";
import { AuthorsSchema } from "@/src/schemas/events/eventSchema";

const NewGroupInputSchemaValidator = TypeCompiler.Compile(NewGroupInputSchema);

const AuthorsSchemaValidator = TypeCompiler.Compile(AuthorsSchema);

export { NewGroupInputSchemaValidator, AuthorsSchemaValidator };