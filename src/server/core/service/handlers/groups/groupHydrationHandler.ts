import {
  GroupHydratedSchemaType,
  GroupSchemaType,
  GroupDiscoverySummarySchemaType,
  GroupHydratedSchema,
} from "@/src/schemas/groups/groupSchema";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { GroupServiceDb } from "../../services/types";
import { IEventLayoutComposer } from "../events/types";
import { AuthenticatedUserId } from "../session/SessionHandler";
import {
  EventSurfaceSchemaType,
  GroupEventSummarySchemaType,
} from "../../../../../schemas/events/eventSchema";
import { validateOrThrow } from "../../../../../schemas/validateOrThrow";

export interface IGroupHydrationHandler {
  single(
    slug: GroupSchemaType["slug"],
    userId?: AuthenticatedUserId,
  ): Promise<GroupHydratedSchemaType>;
  readonly list: IListGroupsHandler;
}

export class GroupHydrationHandler implements IGroupHydrationHandler {
  public readonly list: IListGroupsHandler;
  constructor(
    private readonly db: GroupServiceDb,
    private readonly eventLayouts: IEventLayoutComposer,
  ) {
    this.list = new ListGroupsHandler(this.db);
  }
  async single(
    slug: GroupSchemaType["slug"],
    userId?: AuthenticatedUserId,
  ): Promise<GroupHydratedSchemaType> {
    const hydrated = await this.db.groups.select.hydrateGroup(slug, userId);
    const { group_events, next_event, calandar, ...rest } = hydrated.meta;
    const groupEventSurfaces = this.toGroupEventSurfaces(group_events);
    const layout = this.eventLayouts.compileLayout(groupEventSurfaces);

    const hydratedGroup = {
      group: hydrated.group,
      meta: {
        events: {
          group_events: layout,
          next_event,
          calandar,
        },
        ...rest,
      },
    };
    return validateOrThrow(GroupHydratedSchema, hydratedGroup);
  }

  private toGroupEventSurfaces(
    events: GroupEventSummarySchemaType[],
  ): Extract<EventSurfaceSchemaType, { for: "withinGroup" }>[] {
    return events.map((content) => ({
      for: "withinGroup",
      content,
    }));
  }
}

interface IListGroupsHandler {
  discovery(): Promise<GroupDiscoverySummarySchemaType[]>;
  popular(): Promise<GroupDiscoverySummarySchemaType[]>;
  byCategory(
    categoryId: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
}

class ListGroupsHandler implements IListGroupsHandler {
  constructor(private readonly db: GroupServiceDb) {}
  async discovery(): Promise<GroupDiscoverySummarySchemaType[]> {
    return await this.db.groups.select.all();
  }

  async popular(): Promise<GroupDiscoverySummarySchemaType[]> {
    return await this.db.groups.select.popular();
  }

  async byCategory(
    categoryId: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    return await this.db.groups.select.byCategory(categoryId);
  }
}
