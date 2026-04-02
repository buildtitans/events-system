import { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { TRPCError } from "@trpc/server";

export function typeboxInput<T>(validator: { Check(value: unknown): boolean }) {
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

export function typeboxInputV2<T>(schema: TSchema) {
  const validator = TypeCompiler.Compile(schema);

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
