import { UserMembershipSurfaceSchemaType } from "../../../../../../../../schemas/groups/userMembershipSchema";
import { AuthenticatedUserId } from "../../../../../../service/handlers/session/SessionHandler";
import { IGroupMembersReader } from "./groupMembersReader";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupMembersValidator } from "../validate/groupMembersValidator";

export interface IGroupMembersSelector {
  memberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["group_id"][]>;
  role(
    group_id: GroupMemberSchemaType["group_id"],
    userId: AuthenticatedUserId,
  ): Promise<GroupMemberSchemaType["role"]>;
  memberships(
    user_id: AuthenticatedUserId,
  ): Promise<UserMembershipSurfaceSchemaType[]>;
}

export class GroupMembersSelector implements IGroupMembersSelector {
  constructor(
    private readonly read: IGroupMembersReader,
    private readonly validator: GroupMembersValidator,
  ) {}

  async memberships(
    user_id: AuthenticatedUserId,
  ): Promise<UserMembershipSurfaceSchemaType[]> {
    const raw = await this.read.memberships(user_id);
    return this.validator.memberships(raw);
  }

  async memberIds(
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType["group_id"][]> {
    const raw = await this.read.rawMemberIds(group_id);
    return this.validator.memberIds(raw);
  }

  async role(
    group_id: GroupMemberSchemaType["group_id"],
    userId: AuthenticatedUserId,
  ): Promise<GroupMemberSchemaType["role"]> {
    const role = await this.read.role(group_id, userId);
    return this.validator.role(role);
  }
}
