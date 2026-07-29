import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type {
  GroupSlugsByIds,
  SuggestionOptions,
  SuggestionType,
} from "@/src/lib/hooks/search/types";

export interface ISearchResultsCompiler {
  compileOptions(
    events: EventSchemaType[],
    groups: GroupSchemaType[],
    storedGroups: GroupSchemaType[],
  ): SuggestionOptions;
}

export class SearchResultsCompiler implements ISearchResultsCompiler {
  compileOptions(
    events: EventSchemaType[],
    groups: GroupSchemaType[],
    storedGroups: GroupSchemaType[],
  ): SuggestionOptions {
    let options: SuggestionType[] = [];

    const slugsByIds = this.mapSlugsByGroupIds(storedGroups);
    const groupSuggestions = this.mapGroupSuggestions(groups);
    const eventSuggestions = this.mapEventSuggestions(events, slugsByIds);

    options = [...eventSuggestions, ...groupSuggestions];
    return options;
  }

  private mapEventSuggestions(
    events: EventSchemaType[],
    slugsByIds: GroupSlugsByIds,
  ): SuggestionOptions {
    const arr: SuggestionOptions = [];

    for (const event of events) {
      const groupSlug = slugsByIds[event.group_id];

      const itemLabel = `Event: \n ${event.title}`;

      arr.push({
        kind: "event",
        label: itemLabel,
        event_id: event.id,
        group_id: event.group_id,
        slug: groupSlug,
      });
    }

    return arr;
  }

  private mapGroupSuggestions(groups: GroupSchemaType[]): SuggestionOptions {
    const arr: SuggestionOptions = [];

    for (const group of groups) {
      const itemLabel = `Group: \n ${group.name}`;

      arr.push({
        kind: "group",
        label: itemLabel,
        group_id: group.id,
        slug: group.slug,
      });
    }
    return arr;
  }

  private mapSlugsByGroupIds(storedGroups: GroupSchemaType[]): GroupSlugsByIds {
    const slugHash: GroupSlugsByIds = {};
    for (const group of storedGroups) {
      slugHash[group.id] = group.slug;
    }
    return slugHash;
  }
}
