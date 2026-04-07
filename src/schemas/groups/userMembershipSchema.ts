import { Type, Static } from "@sinclair/typebox";
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
