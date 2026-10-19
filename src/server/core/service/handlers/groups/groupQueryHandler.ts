import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { SearchSchema } from "@/src/schemas/search/searchSchema";
import {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  GroupSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import {
  CategoriesSchemaType,
  CategorySchemaType,
} from "@/src/schemas/groups/categoriesSchema";
import { IGroupQueryHandler } from "./types";
import { GroupServiceDb } from "../../services/types";
import { IAuthorization } from "../../auth/authorization";

export class GroupQueryHandler implements IGroupQueryHandler {
  constructor(
    private readonly db: GroupServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  async hydrateGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<GroupHydratedSchemaType> {
    return await this.db.groups.select.hydrateGroup(group_id);
  }

  async getGroupCategories(): Promise<CategoriesSchemaType> {
    return await this.db.categories.getCategories();
  }

  async discovery(): Promise<GroupSchemaType[]> {
    return await this.db.groups.select.all();
  }

  async popular(): Promise<GroupSchemaType[]> {
    return await this.db.groups.select.popular();
  }

  async byCategory(
    categoryId: CategorySchemaType["id"],
  ): Promise<GroupSchemaType[]> {
    return await this.db.groups.select.byCategory(categoryId);
  }

  async suggestGroups(query: string): Promise<GroupSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = validateOrThrow(SearchSchema, trimmed);
    return await this.db.groups.select.suggestByName(validatedQuery);
  }

  async searchGroups(query: string): Promise<GroupSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = validateOrThrow(SearchSchema, trimmed);
    return await this.db.groups.select.search(validatedQuery);
  }

  async archives(
    user_id: AuthenticatedUserId | undefined | null,
    id: GroupSchemaType["id"],
  ): Promise<ArchivedEventSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireOrganizer(userId, id);
    return await this.db.groups.select.archives(id);
  }
}
