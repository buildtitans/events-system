import { EventAttendantsSchemaType } from "../../../../../schemas/events/eventAttendantsSchema";
import { GroupMemberSchemaType } from "../../../../../schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "../../../../../schemas/groups/groupSchema";
import { IAuthorization } from "../../auth/authorization";
import { UserServiceDb } from "../../services/types";
import { AuthenticatedUserId } from "../session/SessionHandler";

export interface IUserWriteHandler {
  rsvp(
    user_id: AuthenticatedUserId | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType>;
  joinGroup(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType>;
  leaveGroup(
    group_id: GroupSchemaType["id"],
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<boolean>;
}

export class UserWriteHandler implements IUserWriteHandler {
  constructor(
    private readonly db: UserServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  public async joinGroup(
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
  ): Promise<boolean> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireCanChangeMembership(userId, group_id);
    return await this.db.groupMembers.write.removeMember(userId, group_id);
  }

  public async rsvp(
    user_id: AuthenticatedUserId | undefined | null,
    event_id: string,
    newStatus: EventAttendantsSchemaType["status"],
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.eventAttendants.write.updateAttendanceStatus(
      { event_id, user_id: userId },
      newStatus,
    );
  }
}
