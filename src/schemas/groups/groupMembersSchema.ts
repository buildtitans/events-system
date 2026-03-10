import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";
import { createValidator } from "@/src/lib/utils/validation/validateSchema";
import { typeboxInput } from "@/src/server/src/router/adaptors/typeBoxValidation";

export const GroupRoleSchema = Type.Union([
  Type.Literal("member"),
  Type.Literal("organizer"),
  Type.Literal("anonymous"),
]);

const GroupMembersSchema = Type.Object({
  group_id: Type.String(),
  user_id: Type.String(),
  role: Type.Union([
    Type.Literal("member"),
    Type.Literal("organizer"),
    Type.Literal("anonymous"),
  ]),
  joined_at: Type.String(),
});

const MemberToRemoveSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
});

const GroupIDForInsertSchema = Type.String();

const GroupMembersArraySchema = Type.Array(GroupMembersSchema);

type MemberToRemoveSchemaType = Static<typeof MemberToRemoveSchema>;

type GroupMembersArraySchemaType = Static<typeof GroupMembersArraySchema>;

type GroupMembersSchemaType = Static<typeof GroupMembersSchema>;

type GroupIDForInsertSchemaType = Static<typeof GroupIDForInsertSchema>;

type GroupRoleSchemaType = Static<typeof GroupRoleSchema>;

export { GroupMembersSchema, GroupIDForInsertSchema };

export type {
  GroupMembersSchemaType,
  GroupIDForInsertSchemaType,
  GroupMembersArraySchemaType,
  MemberToRemoveSchemaType,
  GroupRoleSchemaType,
};

export const GroupIDForInsertSchemaValidator = TypeCompiler.Compile(
  GroupIDForInsertSchema,
);

export const CompiledMemberToRemoveSchema =
  TypeCompiler.Compile(MemberToRemoveSchema);

export const GroupMembersSchemaValidator =
  TypeCompiler.Compile(GroupMembersSchema);

export const ValidateGroupMember = createValidator(
  GroupMembersSchema,
  "GroupMembersSchema",
);

export const ValidateGroupMembersArray = createValidator(
  GroupMembersArraySchema,
  "GroupMembersArraySchema",
);

export const MemberToRemoveInputValidator =
  typeboxInput<MemberToRemoveSchemaType>(CompiledMemberToRemoveSchema);
