import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
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
  suggestions(
    query: string,
    storedGroups: GroupSchemaType[],
  ): Promise<SuggestionOptions>;
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

  public async suggestions(
    query: string,
    storedGroups: GroupSchemaType[],
  ): Promise<SuggestionOptions> {
    const { events, groups } = await this.fireSuggestionsQuery(query);
    return this.compiler.compileSuggestionOptions(events, groups, storedGroups);
  }

  private async fireSearchQuery(
    query: string,
  ): Promise<{ events: EventSchemaType[]; groups: GroupSchemaType[] }> {
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
  ): Promise<{ events: EventSchemaType[]; groups: GroupSchemaType[] }> {
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
