import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { DBClient } from "../../../db";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import { buildGroupNameLookup } from "../../../lib/utils/buildGroupNameLookup";
import type { NameSlugDescriptionLookup } from "../../../lib/utils/buildGroupNameLookup";

export class GroupQueryHandler {
  constructor(private readonly db: DBClient) {}

  async getGroupCategories(): Promise<CategoriesSchemaType> {
    return await this.db.categories.getCategories();
  }

  async getGroupNameDictionary(): Promise<NameSlugDescriptionLookup> {
    const groups = await this.db.groups.getGroups();
    return buildGroupNameLookup(groups);
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
    return await this.db.groups.getGroupBySlug(slug);
  }
}
