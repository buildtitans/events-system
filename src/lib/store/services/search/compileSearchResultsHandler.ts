import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type {
  GroupSlugsByIds,
  SearchResult,
  SearchResults,
  SuggestionOptions,
  SuggestionType,
} from "@/src/lib/hooks/search/types";

export interface ISearchResultsCompiler {
  compileSuggestionOptions(
    events: EventSchemaType[],
    groups: GroupSchemaType[],
    storedGroups: GroupSchemaType[],
  ): SuggestionOptions;
  compileSearchResults(
    events: EventSchemaType[],
    groups: GroupSchemaType[],
    query: string,
  ): SearchResults;
}

export class SearchResultsCompiler implements ISearchResultsCompiler {
  compileSuggestionOptions(
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

  compileSearchResults(
    events: EventSchemaType[],
    groups: GroupSchemaType[],
    query: string,
  ): SearchResults {
    const results = this.toResultDTO(groups, events);
    return this.sortSearchResults(results, query);
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

  private toResultDTO(
    groups: GroupSchemaType[],
    events: EventSchemaType[],
  ): SearchResult[] {
    return [
      ...groups.map((group) => ({
        kind: "group" as const,
        data: group,
      })),
      ...events.map((event) => ({
        kind: "event" as const,
        data: event,
      })),
    ];
  }

  private sortSearchResults(
    results: SearchResult[],
    query: string,
  ): SearchResult[] {
    return results.sort((left, right) => {
      const leftLabel =
        left.kind === "group" ? left.data.name : left.data.title;
      const rightLabel =
        right.kind === "group" ? right.data.name : right.data.title;

      const relevanceDifference =
        this.relevance(leftLabel, query) - this.relevance(rightLabel, query);

      if (relevanceDifference !== 0) return relevanceDifference;

      if (left.kind !== right.kind) {
        return left.kind === "group" ? -1 : 1;
      }

      return leftLabel.localeCompare(rightLabel);
    });
  }

  private relevance(value: string, query: string): number {
    const normalizedValue = value.toLocaleLowerCase();
    const normalizedQuery = query.toLocaleLowerCase();

    if (normalizedValue === normalizedQuery) return 0;
    if (normalizedValue.startsWith(normalizedQuery)) return 1;
    return 2;
  }
}
