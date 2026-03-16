import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../../db";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { AuthorizationService } from "../auth/authorization";

export class MembershipHandler {
  constructor(
    private readonly db: DBClient,
    private readonly policy: AuthorizationService,
  ) {}

  async addMember(
    user_id: string | undefined,
    group_id: GroupMemberSchemaType["group_id"],
  ) {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanChangeMembership(userId, group_id);

    return await this.db.groupMembers.addNewMember({
      user_id: userId,
      group_id,
    });
  }

  async leaveGroup(
    group_id: GroupSchemaType["id"],
    user_id: string | undefined | null,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanChangeMembership(userId, group_id);

    return await this.db.groupMembers.removeMember(userId, group_id);
  }

  async getRoleInGroup(
    user_id: string | undefined,
    group_id: GroupSchemaType["id"],
  ) {
    if (!user_id) return "anonymous";

    const role = await this.db.groupMembers.getMembershipRole(
      user_id,
      group_id,
    );

    return role ?? "anonymous";
  }

  async getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number> {
    const members = await this.db.groupMembers.getGroupMembers(group_id);

    return members.length;
  }
}
