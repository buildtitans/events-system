import {
  SearchResultSchemaType,
  SearchResultsSchema,
  SearchSchema,
  SearchSchemaType,
  SearchSuggestionSchemaType,
  SuggestionsSchema,
} from "../../../../schemas/search/searchSchema";
import { validateOrThrow } from "../../../../schemas/validateOrThrow";
import { IDBClient } from "../../db/access/client/dbClient";
import {
  ISearchResultsCompiler,
  SearchResultsCompiler,
} from "../handlers/search/compileSearchResultsHandler";

export interface ISearchService {
  search(query: SearchSchemaType): Promise<SearchResultSchemaType[]>;
  suggestions(query: SearchSchemaType): Promise<SearchSuggestionSchemaType[]>;
}

export class SearchService implements ISearchService {
  private readonly compile: ISearchResultsCompiler;
  constructor(private readonly db: Pick<IDBClient, "events" | "groups">) {
    this.compile = new SearchResultsCompiler();
  }

  public async search(
    query: SearchSchemaType,
  ): Promise<SearchResultSchemaType[]> {
    return await this.executeSearch(query);
  }

  public async suggestions(
    query: SearchSchemaType,
  ): Promise<SearchSuggestionSchemaType[]> {
    return await this.getSuggestions(query);
  }

  private async getSuggestions(query: SearchSchemaType) {
    const trimmed = query.trim();
    const validQuery = validateOrThrow(SearchSchema, trimmed);

    const [events, groups] = await Promise.all([
      this.db.events.select.query.suggest(validQuery),
      this.db.groups.select.query.suggestByName(validQuery),
    ]);

    const result = this.compile.compileSuggestionOptions(events, groups);
    return validateOrThrow(SuggestionsSchema, result);
  }

  private async executeSearch(query: SearchSchemaType) {
    const trimmed = query.trim();
    const validQuery = validateOrThrow(SearchSchema, trimmed);
    const [events, groups] = await Promise.all([
      this.db.events.select.query.search(validQuery),
      this.db.groups.select.query.search(validQuery),
    ]);

    const result = this.compile.compileSearchResults(
      events,
      groups,
      validQuery,
    );
    return validateOrThrow(SearchResultsSchema, result);
  }
}
