import { DBClient } from "@/src/server/src/db/clients/dbClient";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export class UserClient {
  constructor(private readonly api: DBClient) {}

  async getGroupsCreated(
    user_id: DbUserSchemaType["id"],
  ): Promise<GroupSchemaType[]> {
    return await this.api.groups.getGroupsByOrganizerId(user_id);
  }

  async getEmailById(
    user_id: DbUserSchemaType["id"],
  ): Promise<DbUserSchemaType["email"]> {
    const { email } = await this.api.auth.getEmailByUserId(user_id);

    return email;
  }
}
