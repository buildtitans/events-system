import "@/src/schemas/format";
import { TSchema } from "@sinclair/typebox";
import { TypeCheck, TypeCompiler } from "@sinclair/typebox/compiler";
import { Static } from "@sinclair/typebox";
import { TRPCError } from "@trpc/server";
const validatorCache = new WeakMap<TSchema, TypeCheck<TSchema>>();

export function validateRouterInput<T extends TSchema>(schema: T) {
  const validator = getValidator(schema);
  return parseTypeboxInput<Static<T>>(validator);
}

function parseTypeboxInput<T>(validator: { Check(value: unknown): boolean }) {
  return (raw: unknown) => {
    if (!validator.Check(raw)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid input",
      });
    }
    return raw as T;
  };
}

function getValidator(schema: TSchema) {
  let validator = validatorCache.get(schema);

  if (!validator) {
    validator = TypeCompiler.Compile(schema);
    validatorCache.set(schema, validator);
  }
  return validator;
}
