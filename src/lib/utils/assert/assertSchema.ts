import type { Static, TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export function assertSchema<T extends TSchema>(
  value: unknown,
  schema: T,
): Static<T> {
  Value.Assert(schema, value);

  return value as Static<T>;
}
