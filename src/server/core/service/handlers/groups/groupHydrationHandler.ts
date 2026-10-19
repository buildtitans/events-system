import {
  GroupHydratedSchemaType,
  GroupSchemaType,
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
  discovery(): Promise<GroupSchemaType[]>;
  popular(): Promise<GroupSchemaType[]>;
  byCategory(categoryId: CategorySchemaType["id"]): Promise<GroupSchemaType[]>;
}

class ListGroupsHandler implements IListGroupsHandler {
  constructor(private readonly db: GroupServiceDb) {}
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
}
