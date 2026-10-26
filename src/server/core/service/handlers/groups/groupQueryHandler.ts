import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
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
    return this.db.groups.select.query.timeline(id);
  }

  async categories(): Promise<CategoriesSchemaType> {
    return await this.db.categories.getCategories();
  }

  async archives(
    user_id: AuthenticatedUserId | undefined | null,
    id: GroupSchemaType["id"],
  ): Promise<ArchivedEventSchemaType[]> {
    const userId = this.policy.requireAuthenticated(user_id);
    await this.policy.requireOrganizer(userId, id);
    return await this.db.groups.select.query.archives(id);
  }

  async history(
    id: GroupSchemaType["id"],
  ): Promise<GroupEventSummarySchemaType[]> {
    return await this.db.groups.select.query.history(id);
  }
}
