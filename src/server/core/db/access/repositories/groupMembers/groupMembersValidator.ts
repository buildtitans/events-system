import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  GroupMemberIdsSchema,
  GroupMemberSchema,
  MemberCountSchema,
  GroupRoleSchema,
  GroupMembersArraySchema,
  GroupMembersArraySchemaType,
  GroupMemberSchemaType,
  MemberCountSchemaType,
  NumberOfMembersSchema,
  NumberOfMembersSchemaType,
} from "@/src/schemas/groups/groupMembersSchema";
import { GroupMembers } from "../../../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Selectable } from "kysely";
import { ISO_FORMAT } from "../../../../lib/tokens/isoFormats";
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

  numberOfMembers(raw: unknown): NumberOfMembersSchemaType {
    return validateOrThrow(NumberOfMembersSchema, raw);
  }

  members(raw: Selectable<GroupMembers>[]): GroupMembersArraySchemaType {
    const parsed = raw.map((row: Selectable<GroupMembers>) => {
      const joined = dayjs(row.joined_at).utc().format(ISO_FORMAT);

      const dto = {
        group_id: row.group_id,
        joined_at: joined,
        role: row.role,
        user_id: row.user_id,
      };

      return dto;
    });
    return validateOrThrow(GroupMembersArraySchema, parsed);
  }

  memberCount(counts: Record<string, number>): MemberCountSchemaType {
    return validateOrThrow(MemberCountSchema, counts);
  }

  role(rawRole: unknown): GroupMemberSchemaType["role"] {
    return validateOrThrow(GroupRoleSchema, rawRole);
  }

  memberIds(ids: unknown): GroupMemberSchemaType["user_id"][] {
    return validateOrThrow(GroupMemberIdsSchema, ids);
  }
}
