import type {
  EventSearchResultSchemaType,
  GroupSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
  GroupSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";

import type { TrpcClientType } from "@/src/trpc/trpcClient";
import type {
  SearchResults,
  SuggestionOptions,
} from "@/src/lib/hooks/search/types";
import {
  SearchResultsCompiler,
  ISearchResultsCompiler,
} from "./compileSearchResultsHandler";

interface IAppSearchService {
  search(query: string): Promise<SearchResults>;
  suggestions(query: string): Promise<SuggestionOptions>;
}

export class AppSearchService implements IAppSearchService {
  private readonly compiler: ISearchResultsCompiler;
  constructor(private readonly trpc: TrpcClientType) {
    this.compiler = new SearchResultsCompiler();
  }

  public async search(query: string): Promise<SearchResults> {
    const { events, groups } = await this.fireSearchQuery(query);
    return this.compiler.compileSearchResults(events, groups, query);
  }

  public async suggestions(query: string): Promise<SuggestionOptions> {
    const { events, groups } = await this.fireSuggestionsQuery(query);
    return this.compiler.compileSuggestionOptions(events, groups);
  }

  private async fireSearchQuery(
    query: string,
  ): Promise<{ events: EventSearchResultSchemaType[]; groups: GroupSearchResultSchemaType[] }> {
    const [events, groups] = await Promise.all([
      this.trpc.discovery.search.events.query(query),
      this.trpc.discovery.search.groups.query(query),
    ]);

    return {
      events,
      groups,
    };
  }

  private async fireSuggestionsQuery(
    query: string,
  ): Promise<{ events: EventSearchSuggestionSchemaType[]; groups: GroupSearchSuggestionSchemaType[] }> {
    const [events, groups] = await Promise.all([
      this.trpc.discovery.suggest.events.query(query),
      this.trpc.discovery.suggest.groups.query(query),
    ]);

    return {
      events,
      groups,
    };
  }
}
