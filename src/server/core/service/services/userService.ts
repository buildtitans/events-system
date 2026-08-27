import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import {
  AuthenticatedUserId,
  IAuthorization,
} from "../auth/authorization";
import { chunkUserGroupsIntoPages } from "@/src/server/core/lib/utils/chunkUserGroupsToPages";
import { validateLoginCredentials } from "@/src/server/core/lib/validation/validateLoginCredentials";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import {
  buildGroupNameLookup,
  NameSlugDescriptionLookup,
} from "@/src/server/core/lib/utils/buildGroupNameLookup";
import { GroupMembersArraySchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { UserMembershipSchemaArrayValidator } from "@/src/server/core/lib/validation/schemaValidators";
import { NewUserResponse } from "@/src/server/core/db/access/types/types";
import { IUserService, UserServiceDb } from "./types";

export class UserService implements IUserService {
  constructor(
    private readonly db: UserServiceDb,
    private readonly policy: IAuthorization,
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
    return await this.groupsOrganized(userId);
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
    return await this.membershipsOfUser(userId);
  }

  private async groupsOrganized(
    userId: AuthenticatedUserId,
  ): Promise<GroupSchemaType[][]> {
    const createdGroups = await this.db.groups.select.byOrganizerId(userId);
    return chunkUserGroupsIntoPages(createdGroups);
  }

  private async membershipsOfUser(
    userId: AuthenticatedUserId,
  ): Promise<UserMembershipSchemaType[]> {
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
