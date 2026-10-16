import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { EventSchema } from "../events/eventSchema";

export const GroupSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  location: Type.Union([Type.String(), Type.Null()]),
  category_id: Type.Union([Type.String(), Type.Null()]),
  organizer_id: Type.String({ format: "uuid" }),
  created_at: Type.String(),
  updated_at: Type.String(),
});

export const NewGroupInputSchema = Type.Object({
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  location: Type.Union([Type.String(), Type.Null()]),
  category_id: Type.Union([Type.String(), Type.Null()]),
});

export const ArchivedEventSchema = Type.Object({
  event: EventSchema,
  attendance: Type.Object({
    going: Type.Number(),
    interested: Type.Number(),
  }),
});

export const GroupArchivesSchema = Type.Array(ArchivedEventSchema);

export type ArchivedEventSchemaType = Static<typeof ArchivedEventSchema>;

export const GroupSlugSchema = Type.String();

export type GroupSlugSchemaType = Static<typeof GroupSlugSchema>;

export const CompiledGroupSlugSchema = TypeCompiler.Compile(GroupSlugSchema);

export const CompiledNewGroupInputSchema =
  TypeCompiler.Compile(NewGroupInputSchema);

export type NewGroupInputSchemaType = Static<typeof NewGroupInputSchema>;

export const GroupsSchema = Type.Array(GroupSchema);

export type GroupSchemaType = Static<typeof GroupSchema>;

export type GroupsSchemaType = Static<typeof GroupsSchema>;

export const CompiledGroupSchema = TypeCompiler.Compile(GroupSchema);
