import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import { GroupMembersValidator } from "./groupMembersValidator";
import { RawGroupMembersReader } from "./rawGroupMembersReader";
import {
  GroupMemberSchemaType,
  MemberCountSchemaType,
} from "../../../../../../schemas/groups/groupMembersSchema";

export class GroupMembersSelector {
  private readonly read: RawGroupMembersReader;
  constructor(
    private readonly db: Kysely<DB>,
    private readonly validator: GroupMembersValidator,
  ) {
    this.read = new RawGroupMembersReader(this.db);
  }

  async all() {
    const raw = await this.read.allRawMembers();
    return this.validator.members(raw);
  }

  async byUserId(
    user_id: GroupMemberSchemaType["user_id"],
  ): Promise<GroupMemberSchemaType[]> {
    const raw = await this.read.rawByUserId(user_id);
    return this.validator.members(raw);
  }

  async allMembers(group_id: GroupMemberSchemaType["group_id"]) {
    const raw = await this.read.rawByGroupId(group_id);
    return this.validator.members(raw);
  }

  async memberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["group_id"][]> {
    const raw = await this.read.rawMemberIds(group_id);
    return this.validator.memberIds(raw);
  }

  async role(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["role"]> {
    const raw = await this.read.rawRoleInGroup(user_id, group_id);

    if (raw === undefined) {
      return "anonymous";
    }

    return this.validator.role(raw.role);
  }

  async organizer(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType> {
    const raw = await this.read.rawOrganizer(group_id);
    return this.validator.member(raw);
  }

  async memberCounts(
    groupIds: GroupMemberSchemaType["group_id"][],
  ): Promise<MemberCountSchemaType> {
    if (groupIds.length === 0) return {};
    const rows = await this.read.rawMemberCounts(groupIds);

    const counts: Record<string, number> = {};

    for (const row of rows) {
      counts[row.group_id] = Number(row.member_count);
    }

    return this.validator.memberCount(counts);
  }
}
