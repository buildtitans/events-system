import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  GroupMemberIdsSchema,
  GroupMemberSchema,
  GroupRoleSchema,
  GroupMemberSchemaType,
} from "@/src/schemas/groups/groupMembersSchema";
import { GroupMembers } from "../../../../../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Selectable } from "kysely";
import { ISO_FORMAT } from "../../../../../../lib/tokens/isoFormats";
import {
  UserMembershipsSchema,
  UserMembershipSurfaceSchemaType,
} from "@/src/schemas/groups/userMembershipSchema";
dayjs.extend(utc);

export class GroupMembersValidator {
  member(raw: Selectable<GroupMembers>): GroupMemberSchemaType {
    const joined = dayjs(raw.joined_at).utc().format(ISO_FORMAT);

    return validateOrThrow(GroupMemberSchema, {
      group_id: raw.group_id,
      joined_at: joined,
      role: raw.role,
      user_id: raw.user_id,
    });
  }

  memberships(memberships: unknown[]): UserMembershipSurfaceSchemaType[] {
    return validateOrThrow(UserMembershipsSchema, memberships);
  }

  role(rawRole: unknown): GroupMemberSchemaType["role"] {
    return validateOrThrow(GroupRoleSchema, rawRole);
  }

  memberIds(ids: unknown): GroupMemberSchemaType["user_id"][] {
    return validateOrThrow(GroupMemberIdsSchema, ids);
  }
}
