
import { UserMembershipSurfaceSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

import { IAuthorization } from "../auth/authorization";
import { chunkUserGroupsIntoPages } from "@/src/server/core/lib/utils/chunkUserGroupsToPages";
import { validateLoginCredentials } from "@/src/server/core/lib/validation/validateLoginCredentials";

import { NewUserResponse } from "@/src/server/core/db/access/types/types";
import { IUserService, UserServiceDb } from "./types";
import { AuthenticatedUserId } from "../handlers/session/SessionHandler";

export class UserService implements IUserService {
  constructor(
    private readonly db: UserServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  public async memberships(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<UserMembershipSurfaceSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.groupMembers.select.memberships(userId);
  }

  async createNewUser(
    emailInput: string,
    passwordInput: string,
  ): Promise<NewUserResponse> {
    const { email, password } = validateLoginCredentials(
      emailInput,
      passwordInput,
    );

    return await this.db.auth.signUp(email, password);
  }

  async getGroupsCreated(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<GroupSchemaType[][]> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.groupsOrganized(userId);
  }

  async getEmailById(
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<DbUserSchemaType["email"]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const { email } = await this.db.auth.getEmailByUserId(userId);
    return email;
  }

  private async groupsOrganized(
    userId: AuthenticatedUserId,
  ): Promise<GroupSchemaType[][]> {
    const createdGroups = await this.db.groups.select.byOrganizerId(userId);
    return chunkUserGroupsIntoPages(createdGroups);
  }
}
