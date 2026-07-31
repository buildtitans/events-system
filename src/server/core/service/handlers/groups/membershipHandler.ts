import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { Authorization } from "../../auth/authorization";
import { IMembershipHandler } from "./types";
import { GroupServiceDb } from "../../services/types";

export class MembershipHandler implements IMembershipHandler {
  constructor(
    private readonly db: GroupServiceDb,
    private readonly policy: Authorization,
  ) {}

  async addMember(
    user_id: string | undefined,
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanChangeMembership(userId, group_id);

    return await this.db.groupMembers.write.newMember({
      user_id: userId,
      group_id,
    });
  }

  async leaveGroup(
    group_id: GroupSchemaType["id"],
    user_id: string | undefined | null,
  ): Promise<boolean> {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanChangeMembership(userId, group_id);

    return await this.db.groupMembers.write.removeMember(userId, group_id);
  }

  async getRoleInGroup(
    user_id: string | undefined,
    group_id: GroupSchemaType["id"],
  ): Promise<GroupMemberSchemaType["role"]> {
    if (!user_id) return "anonymous";

    const role = await this.db.groupMembers.select.role(user_id, group_id);

    return role ?? "anonymous";
  }

  async getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number> {
    const members = await this.db.groupMembers.select.allMembers(group_id);

    return members.length;
  }
}
