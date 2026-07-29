import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";
import type { SuggestionOptions } from "@/src/lib/hooks/search/types";
import {
  SearchResultsCompiler,
  ISearchResultsCompiler,
} from "./compileSearchResultsHandler";

export class AppSearchService {
  private readonly compiler: ISearchResultsCompiler;
  constructor(private readonly trpc: TrpcClientType) {
    this.compiler = new SearchResultsCompiler();
  }

  public async search(
    query: string,
    storedGroups: GroupSchemaType[],
  ): Promise<SuggestionOptions> {
    const { events, groups } = await this.fireQuery(query);
    return this.compiler.compileOptions(events, groups, storedGroups);
  }

  private async fireQuery(
    query: string,
  ): Promise<{ events: EventSchemaType[]; groups: GroupSchemaType[] }> {
    const events = await this.trpc.events.select.search.query(query);
    const groups = await this.trpc.groups.select.search.query(query);

    return {
      events,
      groups,
    };
  }
}
