import { DBClient } from "@/src/server/src/db/clients/dbClient";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { AuthorizationService } from "./authorizationService";
import { mapRoleBasedAccessControls } from "../../lib/utils/mapRoleBasedAccessControls";

export class UserService {
  constructor(
    private readonly api: DBClient,
    private readonly policy: AuthorizationService,
  ) {}

  async createNewUser(email: string, password: string) {
    return await this.api.auth.signUp(email, password);
  }

  async getGroupsCreated(
    user_id: string | null | undefined,
  ): Promise<GroupSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);

    return await this.api.groups.getGroupsByOrganizerId(userId);
  }

  async getEmailById(
    user_id: string | null | undefined,
  ): Promise<DbUserSchemaType["email"]> {
    const userId = this.policy.requireAuthenticated(user_id);

    const { email } = await this.api.auth.getEmailByUserId(userId);

    return email;
  }

  async getRoleBasedLayoutMap(user_id: string | null | undefined) {
    const userId = this.policy.requireAuthenticated(user_id);

    const groups = await this.api.groups.getGroups();

    const memberships =
      await this.api.groupMembers.getViewerMemberships(userId);

    const lookupMap = mapRoleBasedAccessControls(groups, memberships);

    return {
      memberships,
      lookupMap,
    };
  }
}
