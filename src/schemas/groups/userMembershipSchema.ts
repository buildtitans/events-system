import { Type, Static } from "@sinclair/typebox";
import { createValidator } from "@/src/lib/utils/validation/validateSchema";
import { GroupRoleSchema } from "./groupMembersSchema";

export const UserMembershipSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
  group_name: Type.String(),
  location: Type.String(),
  member_count: Type.Number(),
  group_slug: Type.String(),
  roleInGroup: GroupRoleSchema,
});

export type UserMembershipSchemaType = Static<typeof UserMembershipSchema>;

export const UserMembershipSchemaValidator = createValidator(
  UserMembershipSchema,
  "UserMembershipSchema",
);
