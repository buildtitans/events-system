import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../../db";
import { GroupLifecycleHandler } from "../handlers/groupLifecycleHandler";
import { MembershipHandler } from "../handlers/membershipHandler";
import { AuthorizationService } from "./authorizationService";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

export class GroupService {
  public readonly groupLifecycle: GroupLifecycleHandler;
  public readonly memberships: MembershipHandler;

  constructor(
    private readonly db: DBClient,
    private readonly policy: AuthorizationService,
  ) {
    this.groupLifecycle = new GroupLifecycleHandler(this.db, this.policy);
    this.memberships = new MembershipHandler(this.db, this.policy);
  }

  async getGroupCategories(): Promise<CategoriesSchemaType> {
    return await this.db.categories.getCategories();
  }

  async getAllGroups(): Promise<GroupSchemaType[]> {
    return await this.db.groups.getGroups();
  }

  async searchGroups(query: string): Promise<GroupSchemaType[]> {
    return await this.db.groups.searchGroups(query);
  }

  async getAllGroupMembers(group_id: string): Promise<GroupMemberSchemaType[]> {
    return await this.db.groupMembers.getGroupMembers(group_id);
  }

  async getOrganizerEmail(group_id: string): Promise<{ email: string }> {
    const organizer = await this.db.groupMembers.getOrganizer(group_id);

    return this.db.auth.getEmailByUserId(organizer.user_id);
  }

  async getGroupFromSlug(slug: string): Promise<GroupSchemaType> {
    console.log({ slug: slug });

    return await this.db.groups.getGroupBySlug(slug);
  }
}
