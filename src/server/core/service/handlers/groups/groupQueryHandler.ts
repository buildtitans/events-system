import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import {
  CategoriesSchemaType,
  CategorySchemaType,
} from "@/src/schemas/groups/categoriesSchema";
import { buildGroupNameLookup } from "../../../lib/utils/buildGroupNameLookup";
import type { NameSlugDescriptionLookup } from "../../../lib/utils/buildGroupNameLookup";
import { IGroupQueryHandler } from "./types";
import { GroupServiceDb } from "../../services/types";

export class GroupQueryHandler implements IGroupQueryHandler {
  constructor(private readonly db: GroupServiceDb) {}

  async getGroupCategories(): Promise<CategoriesSchemaType> {
    return await this.db.categories.getCategories();
  }

  async getGroupNameDictionary(): Promise<NameSlugDescriptionLookup> {
    const groups = await this.db.groups.select.all();
    return buildGroupNameLookup(groups);
  }

  async getAllGroups(): Promise<GroupSchemaType[]> {
    return await this.db.groups.select.all();
  }

  async byCategory(
    categoryId: CategorySchemaType["id"],
  ): Promise<GroupSchemaType[]> {
    return await this.db.groups.select.byCategory(categoryId);
  }

  async searchGroups(query: string): Promise<GroupSchemaType[]> {
    return await this.db.groups.select.search(query);
  }

  async getAllGroupMembers(group_id: string): Promise<GroupMemberSchemaType[]> {
    return await this.db.groupMembers.select.allMembers(group_id);
  }

  async getOrganizerEmail(group_id: string): Promise<{ email: string }> {
    const organizer = await this.db.groupMembers.select.organizer(group_id);

    return this.db.auth.getEmailByUserId(organizer.user_id);
  }

  async getGroupFromSlug(slug: string): Promise<GroupSchemaType> {
    return await this.db.groups.select.bySlug(slug);
  }
}
