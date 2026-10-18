import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";
import { GroupScheduleSchemaType } from "./userMembershipSchema";
import { GroupSchema } from "./groupSchema";

export const GroupRoleSchema = Type.Union([
  Type.Literal("member"),
  Type.Literal("organizer"),
  Type.Literal("anonymous"),
]);

const GroupMemberSchema = Type.Object({
  group_id: Type.String(),
  user_id: Type.String(),
  role: Type.Union([
    Type.Literal("member"),
    Type.Literal("organizer"),
    Type.Literal("anonymous"),
  ]),
  joined_at: Type.String(),
});

export const NumberOfMembersSchema = Type.Number();

export type NumberOfMembersSchemaType = Static<typeof NumberOfMembersSchema>;

const GroupMemberIdSchema = Type.String();

export const GroupMemberIdsSchema = Type.Array(GroupMemberIdSchema);

export const MemberCountSchema = Type.Record(Type.String(), Type.Number());

const MemberToRemoveSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
});

const GroupIDForInsertSchema = Type.String();

export const GroupMembersArraySchema = Type.Array(GroupMemberSchema);

export type GroupMemberIdSchema = Static<typeof GroupMemberIdSchema>;

type MemberCountSchemaType = Static<typeof MemberCountSchema>;

type MemberToRemoveSchemaType = Static<typeof MemberToRemoveSchema>;

type GroupMembersArraySchemaType = Static<typeof GroupMembersArraySchema>;

type GroupMemberSchemaType = Static<typeof GroupMemberSchema>;

export type GroupSlugSchemaType = Static<typeof GroupSchema.properties.slug>;

type GroupIDForInsertSchemaType = Static<typeof GroupIDForInsertSchema>;

type GroupRoleSchemaType = Static<typeof GroupRoleSchema>;

export { GroupMemberSchema, GroupIDForInsertSchema };

export type {
  GroupMemberSchemaType,
  GroupIDForInsertSchemaType,
  GroupMembersArraySchemaType,
  MemberToRemoveSchemaType,
  GroupRoleSchemaType,
  MemberCountSchemaType,
};

export const GroupSlugValidator = TypeCompiler.Compile(
  GroupSchema.properties.slug,
);

export const GroupIDForInsertSchemaValidator = TypeCompiler.Compile(
  GroupIDForInsertSchema,
);

export const CompiledMemberToRemoveSchema =
  TypeCompiler.Compile(MemberToRemoveSchema);

export const GroupMemberSchemaValidator =
  TypeCompiler.Compile(GroupMemberSchema);
