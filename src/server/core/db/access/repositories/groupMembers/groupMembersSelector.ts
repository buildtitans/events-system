import { GroupMembersValidator } from "./groupMembersValidator";
import { RawGroupMembersReader } from "./rawGroupMembersReader";
import {
  GroupMemberSchemaType,
  MemberCountSchemaType,
} from "@/src/schemas/groups/groupMembersSchema";

export interface IGroupMembersSelector {
  all(): Promise<GroupMemberSchemaType[]>;
  byUserId(
    user_id: GroupMemberSchemaType["user_id"],
  ): Promise<GroupMemberSchemaType[]>;
  allMembers(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType[]>;
  memberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["group_id"][]>;
  role(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["role"]>;
  organizer(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType>;
  memberCounts(
    groupIds: GroupMemberSchemaType["group_id"][],
  ): Promise<MemberCountSchemaType>;
}

export class GroupMembersSelector implements IGroupMembersSelector {
  constructor(
    private readonly read: RawGroupMembersReader,
    private readonly validator: GroupMembersValidator,
  ) {}

  async all(): Promise<GroupMemberSchemaType[]> {
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
