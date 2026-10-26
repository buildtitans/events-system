import {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
  GroupSearchResultSchema,
  GroupSearchSuggestionSchema,
} from "@/src/schemas/search/searchSchema";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import type { IGroupsValidator } from "../validate/groupsValidator";
import type { IGroupsReader } from "../read/groupsReader";
import {
  ArchivedEventSchemaType,
  GroupSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";
import type { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";



export interface IGroupsQuerySelector {
 timeline(id: GroupSchemaType["id"]): Promise<TimelineElementSchemaType[]>;
 history(id: GroupSchemaType["id"]): Promise<GroupEventSummarySchemaType[]>;
 archives(id: GroupSchemaType["id"]): Promise<ArchivedEventSchemaType[]>;
 search(query: string): Promise<GroupSearchResultSchemaType[]>;
 suggestByName(query: string): Promise<GroupSearchSuggestionSchemaType[]>;
}
export class GroupsQuerySelector implements IGroupsQuerySelector {
 constructor(private readonly read: IGroupsReader["query"], private readonly validator: IGroupsValidator) {}
   async timeline(id: GroupSchemaType["id"]) {
    const timeline = await this.read.timeline(id);
    return this.validator.timeline(timeline);
  }
  async history(
    id: GroupSchemaType["id"],
  ): Promise<GroupEventSummarySchemaType[]> {
    const history = await this.read.history(id);
    return this.validator.eventsForGroup(history);
  }
  async archives(id: GroupSchemaType["id"]) {
    const archives = await this.read.archivedEventsWithAttendance(id);
    return this.validator.archives(archives);
  }
  async search(query: string): Promise<GroupSearchResultSchemaType[]> {
    const raw = await this.read.search(query);
    return raw.map((row) => validateOrThrow(GroupSearchResultSchema, row));
  }
  async suggestByName(
    query: string,
  ): Promise<GroupSearchSuggestionSchemaType[]> {
    const raw = await this.read.suggest(query);
    return raw.map((row) => validateOrThrow(GroupSearchSuggestionSchema, row));
  }
}
