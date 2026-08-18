import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const SearchSchema = Type.String({
  minLength: 1,
  maxLength: 100,
  pattern: "\\S",
});

export type SearchSchemaType = Static<typeof SearchSchema>;

export const CompiledSearchSchema = TypeCompiler.Compile(SearchSchema);
