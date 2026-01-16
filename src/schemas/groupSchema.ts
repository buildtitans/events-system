import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const GroupSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    slug: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    location: Type.Union([Type.String(), Type.Null()]),
    category_id: Type.Union([Type.String()]), //changed from -> [Type.String(), Type.Null()]
    organizer_id: Type.Union([Type.String(), Type.Null()]),
    created_at: Type.String(),
    updated_at: Type.String(),
});

export const NewGroupInputSchema = Type.Object({
    name: Type.String(),
    description: Type.Union([Type.String(), Type.Null()]),
    location: Type.Union([Type.String(), Type.Null()]),
    category_id: Type.Union([Type.String(), Type.Null()]),
});

export type NewGroupInputSchemaType = Static<typeof NewGroupInputSchema>;

export const GroupsSchema = Type.Array(GroupSchema);

export type GroupSchemaType = Static<typeof GroupSchema>;

export type GroupsSchemaType = Static<typeof GroupsSchema>;

export const CompiledGroupSchema = TypeCompiler.Compile(GroupSchema);
