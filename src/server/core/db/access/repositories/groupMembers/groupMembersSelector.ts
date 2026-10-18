import { UserMembershipSurfaceSchemaType } from "../../../../../../schemas/groups/userMembershipSchema";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { GroupMembersValidator } from "./groupMembersValidator";
import { RawGroupMembersReader } from "./rawGroupMembersReader";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export interface IGroupMembersSelector {
  memberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["group_id"][]>;
  role(
    user_id: GroupMemberSchemaType["user_id"],
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["role"]>;
  memberships(
    user_id: AuthenticatedUserId,
  ): Promise<UserMembershipSurfaceSchemaType[]>;
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
}
