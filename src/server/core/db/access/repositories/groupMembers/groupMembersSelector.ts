import { UserMembershipSurfaceSchemaType } from "../../../../../../schemas/groups/userMembershipSchema";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { GroupMembersValidator } from "./groupMembersValidator";
import { RawGroupMembersReader } from "./rawGroupMembersReader";
import {
  GroupMemberSchemaType,
  NumberOfMembersSchemaType,
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
  memberships(
    user_id: AuthenticatedUserId,
  ): Promise<UserMembershipSurfaceSchemaType[]>;
  memberCount(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<NumberOfMembersSchemaType>;
}

export class GroupMembersSelector implements IGroupMembersSelector {
  constructor(
    private readonly read: RawGroupMembersReader,
    private readonly validator: GroupMembersValidator,
  ) {}

  async memberships(
    user_id: AuthenticatedUserId,
  ): Promise<UserMembershipSurfaceSchemaType[]> {
    const raw = await this.read.byUserId(user_id);
    return this.validator.memberships(raw);
  }

  async all(): Promise<GroupMemberSchemaType[]> {
    const raw = await this.read.allRawMembers();
    return this.validator.members(raw);
  }

  async memberCount(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<NumberOfMembersSchemaType> {
    const rawCount = await this.read.rawMemberCount(group_id);
    const memberCount = Number(rawCount.member_count);
    return this.validator.numberOfMembers(memberCount);
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
    let role: string;

    const raw = await this.read.rawRoleInGroup(user_id, group_id);
    if (raw) {
      role = raw.role;
    } else {
      role = "anonymous";
    }

    return this.validator.role(role);
  }

  async organizer(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType> {
    const raw = await this.read.rawOrganizer(group_id);
    return this.validator.member(raw);
  }

}
