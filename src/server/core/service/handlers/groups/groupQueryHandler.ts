import type {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { SearchSchema } from "@/src/schemas/search/searchSchema";
import {
  ArchivedEventSchemaType,
  GroupSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import { IGroupQueryHandler } from "./types";
import { GroupServiceDb } from "../../services/types";
import { IAuthorization } from "../../auth/authorization";
import { TimelineElementSchemaType } from "../../../../../schemas/groups/timelineSchema";
import { GroupEventSummarySchemaType } from "../../../../../schemas/events/eventSchema";

export class GroupQueryHandler implements IGroupQueryHandler {
  constructor(
    private readonly db: GroupServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  async calandar(
    id: GroupSchemaType["id"],
  ): Promise<TimelineElementSchemaType[]> {
    return this.db.groups.select.timeline(id);
  }

  async categories(): Promise<CategoriesSchemaType> {
    return await this.db.categories.getCategories();
  }

  async suggestGroups(query: string): Promise<GroupSearchSuggestionSchemaType[]> {
    const trimmed = query.trim();
    const validatedQuery = validateOrThrow(SearchSchema, trimmed);
    return await this.db.groups.select.suggestByName(validatedQuery);
  }

  async searchGroups(query: string): Promise<GroupSearchResultSchemaType[]> {
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

  async pastEvents(id: GroupSchemaType["id"]) {
    const groupEvents = await this.db.events.select.byGroupId(id);
    const history: GroupEventSummarySchemaType[] = [];
    const now = Date.now();

    for (const { event, meta } of groupEvents) {
      if (event.starts_at_ms < now) {
        const data = { event, meta };
        history.push(data);
      }
    }
    history.sort((a, b) => a.event.starts_at_ms - b.event.starts_at_ms);

    return history;
  }
}
