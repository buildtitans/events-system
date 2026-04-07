import { Type, Static } from "@sinclair/typebox";
import { createValidator } from "@/src/shared/utils/validation/validateSchema";
import { GroupRoleSchema } from "./groupMembersSchema";

export const UserMembershipSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
  group_name: Type.String(),
  group_description: Type.String(),
  location: Type.String(),
  member_count: Type.Number(),
  group_slug: Type.String(),
  roleInGroup: GroupRoleSchema,
});

export const UserMembershipSchemaArray = Type.Array(UserMembershipSchema);

export type UserMembershipSchemaArrayType = Static<
  typeof UserMembershipSchemaArray
>;

export type UserMembershipSchemaType = Static<typeof UserMembershipSchema>;

export const UserMembershipSchemaArrayValidator = createValidator(
  UserMembershipSchemaArray,
  "UserMembershipSchemaArray",
);

export const UserMembershipSchemaValidator = createValidator(
  UserMembershipSchema,
  "UserMembershipSchema",
);
