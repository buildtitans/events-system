import { DBClient } from "../../db/access/client/dbClient";
import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { Authorization } from "../auth/authorization";
import { chunkUserGroupsIntoPages } from "../../lib/utils/chunkUserGroupsToPages";
import { validateLoginCredentials } from "../../lib/validation/validateLoginCredentials";
import { UserMembershipSchemaType } from "../../../../schemas/groups/userMembershipSchema";
import {
  buildGroupNameLookup,
  NameSlugDescriptionLookup,
} from "../../lib/utils/buildGroupNameLookup";
import { GroupMembersArraySchemaType } from "../../../../schemas/groups/groupMembersSchema";
import { UserMembershipSchemaArrayValidator } from "../../lib/validation/schemaValidators";
import { NewUserResponse } from "../../db/access/types/types";
import { IUserService } from "./types";

export class UserService implements IUserService {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}

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
    user_id: string | null | undefined,
  ): Promise<GroupSchemaType[][]> {
    const userId = this.policy.requireAuthenticated(user_id);

    const createdGroups = await this.db.groups.select.byOrganizerId(userId);

    return chunkUserGroupsIntoPages(createdGroups);
  }

  async getEmailById(
    user_id: string | null | undefined,
  ): Promise<DbUserSchemaType["email"]> {
    const userId = this.policy.requireAuthenticated(user_id);
    const { email } = await this.db.auth.getEmailByUserId(userId);
    return email;
  }

  async getMemberships(
    user_id: string | null | undefined,
  ): Promise<UserMembershipSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);

    const rawGroups = await this.db.groups.select.all();
    const rawMemberships = await this.db.groupMembers.select.byUserId(userId);

    const nameSlugDescriptionLookup = buildGroupNameLookup(rawGroups);
    return await this.toUserMembershipShape(
      rawMemberships,
      rawGroups,
      nameSlugDescriptionLookup,
    );
  }

  private async toUserMembershipShape(
    rawMemberships: GroupMembersArraySchemaType,
    rawGroups: GroupsSchemaType,
    lookupMap: NameSlugDescriptionLookup,
  ): Promise<UserMembershipSchemaType[]> {
    const groupIds = rawMemberships.map((m) => m.group_id);
    const memberCounts =
      await this.db.groupMembers.select.memberCounts(groupIds);

    const results = rawMemberships.map((membership) => {
      const group = rawGroups.find((grp) => grp.id === membership.group_id);

      return {
        group_id: membership.group_id,
        group_name: group?.name ?? "",
        location: group?.location ?? "",
        roleInGroup: membership.role,
        group_slug: group?.slug ?? "",
        member_count: memberCounts[membership.group_id] ?? 0,
        group_description:
          lookupMap[membership.group_id]?.group_description ?? "",
      };
    });
    return UserMembershipSchemaArrayValidator(results);
  }
}
