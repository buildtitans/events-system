import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { IAuthorization } from "../../auth/authorization";
import { IMembershipHandler } from "./types";
import { GroupServiceDb } from "../../services/types";

export class MembershipHandler implements IMembershipHandler {
  constructor(
    private readonly db: GroupServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  async addMember(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupMemberSchemaType["group_id"],
  ) {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanChangeMembership(userId, group_id);

    return await this.db.groupMembers.write.newMember({
      user_id: userId,
      group_id,
    });
  }

  async leaveGroup(
    group_id: GroupSchemaType["id"],
    user_id: AuthenticatedUserId | undefined | null,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);

    await this.policy.requireCanChangeMembership(userId, group_id);

    return await this.db.groupMembers.write.removeMember(userId, group_id);
  }

  async getRoleInGroup(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupSchemaType["id"],
  ) {
    if (!user_id) return "anonymous";
    return await this.db.groupMembers.select.role(user_id, group_id);
  }
}
