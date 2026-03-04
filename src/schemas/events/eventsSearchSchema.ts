import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const EventSearchSchema = Type.String();

export type EventSearchSchemaType = Static<typeof EventSearchSchema>;

export const CompiledEventSearchSchema =
  TypeCompiler.Compile(EventSearchSchema);
