import "@/src/schemas/format";
import { TSchema } from "@sinclair/typebox";
import { TypeCheck, TypeCompiler } from "@sinclair/typebox/compiler";
import { Static } from "@sinclair/typebox";

const compiledSchemasCache = new WeakMap<TSchema, TypeCheck<TSchema>>();

export function validateOrThrow<T extends TSchema>(
  schema: T,
  data: unknown,
): Static<T> {
  let validator = compiledSchemasCache.get(schema);

  if (!validator) {
    validator = TypeCompiler.Compile(schema);
    compiledSchemasCache.set(schema, validator);
  }

  if (!validator.Check(data)) {
    const details = [...validator.Errors(data)];

    throw new Error("Invalid Schema", { cause: details });
  }

  return data as Static<T>;
}
