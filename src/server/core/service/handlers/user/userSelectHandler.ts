import type { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { RsvpSurfaceSchemaType } from "../../../../../schemas/events/rsvpSchema";
import { GroupRoleSchemaType } from "../../../../../schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "../../../../../schemas/groups/groupSchema";
import { UserMembershipSurfaceSchemaType } from "../../../../../schemas/groups/userMembershipSchema";
import { chunkUserGroupsIntoPages } from "../../../lib/utils/chunkUserGroupsToPages";
import { IAuthorization } from "../../auth/authorization";
import { UserServiceDb } from "../../services/types";
import { AuthenticatedUserId } from "../session/SessionHandler";

export interface IUserSelectHandler {
  rsvps(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<RsvpSurfaceSchemaType[]>;
  memberships(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserMembershipSurfaceSchemaType[]>;
  groups(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<GroupDiscoverySummarySchemaType[][]>;
  roleInGroup(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupSchemaType["id"],
  ): Promise<GroupRoleSchemaType>;
  email(user_id: AuthenticatedUserId | undefined | null): Promise<string>;
}

export class UserSelectHandler implements IUserSelectHandler {
  constructor(
    private readonly db: UserServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  public async roleInGroup(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupSchemaType["id"],
  ): Promise<GroupRoleSchemaType> {
    if (!user_id) return "anonymous";
    return await this.db.groupMembers.select.role(group_id, user_id);
  }

  public async rsvps(
    user_id: AuthenticatedUserId,
  ): Promise<RsvpSurfaceSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.eventAttendants.select.rsvps(userId);
  }

  public async memberships(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserMembershipSurfaceSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.groupMembers.select.memberships(userId);
  }

  public async groups(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<GroupDiscoverySummarySchemaType[][]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const createdGroups = await this.db.groups.select.view.list.byOrganizerId(userId);
    return chunkUserGroupsIntoPages(createdGroups);
  }

  async email(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<string> {
    const userId = this.policy.requireAuthenticated(user_id);
    const { email } = await this.db.auth.getEmailByUserId(userId);
    return email;
  }
}
