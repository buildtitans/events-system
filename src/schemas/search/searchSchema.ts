import { typeboxInput } from "@/src/server/core/router/adaptors/typeBoxValidation";
import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const SearchSchema = Type.String();

export type SearchSchemaType = Static<typeof SearchSchema>;

export const CompiledSearchSchema = TypeCompiler.Compile(SearchSchema);

export const SearchInputSchemaValidator =
  typeboxInput<SearchSchemaType>(CompiledSearchSchema);
