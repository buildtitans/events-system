import {
  makeEventResult,
  makeGroupResult,
  makeEventSuggestion,
  makeGroupSuggestion,
} from "./search.fixtures";
import { AppSearchService } from "@/src/lib/store/services/search/appSearchService";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const makeClient = ({
  searchEvents = jest.fn(),
  searchGroups = jest.fn(),
  suggestEvents = jest.fn(),
  suggestGroups = jest.fn(),
} = {}) =>
  ({
    discovery: {
      search: {
        events: { query: searchEvents },
        groups: { query: searchGroups },
      },
      suggest: {
        events: { query: suggestEvents },
        groups: { query: suggestGroups },
      },
    },
  }) as unknown as TrpcClientType;

describe("AppSearchService", () => {
  it("queries both suggestion endpoints and compiles suggestion options", async () => {
    const query = "react";
    const events = [makeEventSuggestion()];
    const groups = [makeGroupSuggestion()];
    const suggestEvents = jest.fn().mockResolvedValue(events);
    const suggestGroups = jest.fn().mockResolvedValue(groups);
    const service = new AppSearchService(
      makeClient({ suggestEvents, suggestGroups }),
    );

    await expect(service.suggestions(query)).resolves.toEqual([...events, ...groups]);
    expect(suggestEvents).toHaveBeenCalledWith(query);
    expect(suggestGroups).toHaveBeenCalledWith(query);
  });

  it("queries both search endpoints and returns compiled full results", async () => {
    const query = "react";
    const event = makeEventResult();
    const group = makeGroupResult();
    const searchEvents = jest.fn().mockResolvedValue([event]);
    const searchGroups = jest.fn().mockResolvedValue([group]);
    const service = new AppSearchService(
      makeClient({ searchEvents, searchGroups }),
    );

    await expect(service.search(query)).resolves.toEqual([
      group,
      event,
    ]);
    expect(searchEvents).toHaveBeenCalledWith(query);
    expect(searchGroups).toHaveBeenCalledWith(query);
  });

  it("rejects when a suggestion request fails", async () => {
    const error = new Error("events unavailable");
    const service = new AppSearchService(
      makeClient({
        suggestEvents: jest.fn().mockRejectedValue(error),
        suggestGroups: jest.fn().mockResolvedValue([]),
      }),
    );

    await expect(service.suggestions("react")).rejects.toBe(error);
  });

  it("rejects when a search request fails", async () => {
    const error = new Error("groups unavailable");
    const service = new AppSearchService(
      makeClient({
        searchEvents: jest.fn().mockResolvedValue([]),
        searchGroups: jest.fn().mockRejectedValue(error),
      }),
    );

    await expect(service.search("react")).rejects.toBe(error);
  });
});
