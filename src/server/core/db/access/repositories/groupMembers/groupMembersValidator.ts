import { GroupMembers } from "../../../types/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Selectable } from "kysely";
import {
  GroupMembersArraySchemaType,
  GroupMemberSchemaType,
  MemberCountSchemaType,
} from "@/src/schemas/groups/groupMembersSchema";
import {
  GroupMemberIdsSchemaValidator,
  GroupRoleSchemaValidator,
  MemberCountSchemaValidator,
  ValidateGroupMember,
  ValidateGroupMembersArray,
} from "@/src/server/core/lib/validation/schemaValidators";
import { ISO_FORMAT } from "../../../../lib/tokens/isoFormats";
dayjs.extend(utc);

export class GroupMembersValidator {
  member(raw: Selectable<GroupMembers>): GroupMemberSchemaType {
    const joined = dayjs(raw.joined_at).utc().format(ISO_FORMAT);

    return ValidateGroupMember({
      group_id: raw.group_id,
      joined_at: joined,
      role: raw.role,
      user_id: raw.user_id,
    });
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
    return ValidateGroupMembersArray(parsed);
  }

  memberCount(counts: Record<string, number>): MemberCountSchemaType {
    return MemberCountSchemaValidator(counts);
  }

  role(rawRole: unknown): GroupMemberSchemaType["role"] {
    return GroupRoleSchemaValidator(rawRole);
  }

  memberIds(ids: unknown): GroupMemberSchemaType["user_id"][] {
    return GroupMemberIdsSchemaValidator(ids);
  }
}
