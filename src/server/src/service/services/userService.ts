import { DBClient } from "@/src/server/src/db/clients/dbClient";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { Authorization } from "../auth/authorization";
import { chunkUserGroupsIntoPages } from "../../lib/utils/chunkUserGroupsToPages";

export class UserService {
  constructor(
    private readonly api: DBClient,
    private readonly policy: Authorization,
  ) {}

  async createNewUser(email: string, password: string) {
    return await this.api.auth.signUp(email, password);
  }

  async getGroupsCreated(
    user_id: string | null | undefined,
  ): Promise<GroupSchemaType[][]> {
    const userId = this.policy.requireAuthenticated(user_id);

    const createdGroups = await this.api.groups.getGroupsByOrganizerId(userId);

    return chunkUserGroupsIntoPages(createdGroups);
  }

  async getEmailById(
    user_id: string | null | undefined,
  ): Promise<DbUserSchemaType["email"]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const { email } = await this.api.auth.getEmailByUserId(userId);
    return email;
  }
}
