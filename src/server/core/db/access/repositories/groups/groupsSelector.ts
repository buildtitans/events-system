import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { GroupsValidator } from "./groupsValidator";
import { IGroupsReader } from "./rawGroupsReader";
import {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  GroupSchemaType,
} from "@/src/schemas/groups/groupSchema";

export interface IGroupsSelector {
  hydrateGroup(id: GroupSchemaType["id"]): Promise<GroupHydratedSchemaType>;
  all(): Promise<GroupSchemaType[]>;
  byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupSchemaType[]>;
  search(query: string): Promise<GroupSchemaType[]>;
  byCategory(
    category_id: CategorySchemaType["name"],
  ): Promise<GroupSchemaType[]>;
  suggestByName(query: string): Promise<GroupSchemaType[]>;
  archives(id: GroupSchemaType["id"]): Promise<ArchivedEventSchemaType[]>;
  popular(): Promise<GroupSchemaType[]>;
}

export class GroupsSelector implements IGroupsSelector {
  constructor(
    private readonly read: IGroupsReader,
    private readonly validator: GroupsValidator,
  ) {}

  async hydrateGroup(id: GroupSchemaType["id"]) {
    const hydratedGroup = await this.read.hydrateGroup(id);
    return this.validator.hydrated(hydratedGroup);
  }

  async all(): Promise<GroupSchemaType[]> {
    const raw = await this.read.allGroups();
    return this.validator.groups(raw);
  }

  async popular(): Promise<GroupSchemaType[]> {
    const raw = await this.read.popularGroups();
    return this.validator.groups(raw);
  }

  async archives(id: GroupSchemaType["id"]) {
    const archives = await this.read.archivedEventsWithAttendance(id);
    return this.validator.archives(archives);
  }

  async byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawByOrganizerId(organizer_id);
    return this.validator.groups(raw);
  }

  async byCategory(
    category_id: CategorySchemaType["name"],
  ): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawByCategoryId(category_id);
    return this.validator.groups(raw);
  }

  async suggestByName(query: string): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawSuggestByName(query);
    return this.validator.groups(raw);
  }

  async search(query: string): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawSearchByName(query);
    return this.validator.groups(raw);
  }
}
