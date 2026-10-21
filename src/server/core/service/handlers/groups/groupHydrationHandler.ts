import {
  GroupHydratedSchemaType,
  GroupSchemaType,
  GroupDiscoverySummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { GroupServiceDb } from "../../services/types";

export interface IGroupHydrationHandler {
  single(group_id: GroupSchemaType["id"]): Promise<GroupHydratedSchemaType>;
  readonly list: IListGroupsHandler;
}

export class GroupHydrationHandler implements IGroupHydrationHandler {
  public readonly list: IListGroupsHandler;
  constructor(private readonly db: GroupServiceDb) {
    this.list = new ListGroupsHandler(this.db);
  }
  async single(
    group_id: GroupSchemaType["id"],
  ): Promise<GroupHydratedSchemaType> {
    return await this.db.groups.select.hydrateGroup(group_id);
  }
}

interface IListGroupsHandler {
  discovery(): Promise<GroupDiscoverySummarySchemaType[]>;
  popular(): Promise<GroupDiscoverySummarySchemaType[]>;
  byCategory(categoryId: CategorySchemaType["id"]): Promise<GroupDiscoverySummarySchemaType[]>;
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
