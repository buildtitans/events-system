import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";

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

export const MemberCountSchema = Type.Record(Type.String(), Type.Number());

const MemberToRemoveSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
});

const GroupIDForInsertSchema = Type.String();

export const GroupMembersArraySchema = Type.Array(GroupMemberSchema);

type MemberCountSchemaType = Static<typeof MemberCountSchema>;

type MemberToRemoveSchemaType = Static<typeof MemberToRemoveSchema>;

type GroupMembersArraySchemaType = Static<typeof GroupMembersArraySchema>;

type GroupMemberSchemaType = Static<typeof GroupMemberSchema>;

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

export const GroupIDForInsertSchemaValidator = TypeCompiler.Compile(
  GroupIDForInsertSchema,
);

export const CompiledMemberToRemoveSchema =
  TypeCompiler.Compile(MemberToRemoveSchema);

export const GroupMemberSchemaValidator =
  TypeCompiler.Compile(GroupMemberSchema);
