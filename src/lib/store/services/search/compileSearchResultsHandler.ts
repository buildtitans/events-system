import type {
  EventSearchResultSchemaType,
  GroupSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
  GroupSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
import type { SearchResults, SuggestionOptions } from "@/src/lib/hooks/search/types";

export interface ISearchResultsCompiler {
  compileSuggestionOptions(events: EventSearchSuggestionSchemaType[], groups: GroupSearchSuggestionSchemaType[]): SuggestionOptions;
  compileSearchResults(events: EventSearchResultSchemaType[], groups: GroupSearchResultSchemaType[], query: string): SearchResults;
}

export class SearchResultsCompiler implements ISearchResultsCompiler {
  compileSuggestionOptions(events: EventSearchSuggestionSchemaType[], groups: GroupSearchSuggestionSchemaType[]): SuggestionOptions {
    return [...events, ...groups];
  }

  compileSearchResults(events: EventSearchResultSchemaType[], groups: GroupSearchResultSchemaType[], query: string): SearchResults {
    return [...groups, ...events].sort((left, right) => {
      const leftLabel = left.data.meta.label;
      const rightLabel = right.data.meta.label;
      const difference = this.relevance(leftLabel, query) - this.relevance(rightLabel, query);
      if (difference !== 0) return difference;
      if (left.kind !== right.kind) return left.kind === "group" ? -1 : 1;
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
