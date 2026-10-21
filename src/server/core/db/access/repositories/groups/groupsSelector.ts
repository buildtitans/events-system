import {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
  GroupSearchResultSchema,
  GroupSearchSuggestionSchema,
} from "@/src/schemas/search/searchSchema";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { GroupsValidator } from "./groupsValidator";
import { IGroupsReader } from "./rawGroupsReader";
import {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  GroupSchemaType,
  GroupDiscoverySummarySchemaType,
} from "@/src/schemas/groups/groupSchema";
import { TimelineElementSchemaType } from "../../../../../../schemas/groups/timelineSchema";

export interface IGroupsSelector {
  hydrateGroup(id: GroupSchemaType["id"]): Promise<GroupHydratedSchemaType>;
  timeline(id: GroupSchemaType["id"]): Promise<TimelineElementSchemaType[]>;
  all(): Promise<GroupDiscoverySummarySchemaType[]>;
  byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
  search(query: string): Promise<GroupSearchResultSchemaType[]>;
  byCategory(
    category_id: CategorySchemaType["name"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
  suggestByName(query: string): Promise<GroupSearchSuggestionSchemaType[]>;
  archives(id: GroupSchemaType["id"]): Promise<ArchivedEventSchemaType[]>;
  popular(): Promise<GroupDiscoverySummarySchemaType[]>;
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

  async timeline(id: GroupSchemaType["id"]) {
    const timeline = await this.read.timeline(id);
    return this.validator.timeline(timeline);
  }

  async all(): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.allGroups();
    return this.validator.discovery(raw);
  }

  async popular(): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.popularGroups();
    return this.validator.discovery(raw);
  }

  async archives(id: GroupSchemaType["id"]) {
    const archives = await this.read.archivedEventsWithAttendance(id);
    return this.validator.archives(archives);
  }

  async byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.byOrganizerId(organizer_id);
    return this.validator.discovery(raw);
  }

  async byCategory(
    category_id: CategorySchemaType["name"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.byCategoryId(category_id);
    return this.validator.discovery(raw);
  }

  async suggestByName(
    query: string,
  ): Promise<GroupSearchSuggestionSchemaType[]> {
    const raw = await this.read.suggestions(query);
    return raw.map((row) => validateOrThrow(GroupSearchSuggestionSchema, row));
  }

  async search(query: string): Promise<GroupSearchResultSchemaType[]> {
    const raw = await this.read.search(query);
    return raw.map((row) => validateOrThrow(GroupSearchResultSchema, row));
  }
}
