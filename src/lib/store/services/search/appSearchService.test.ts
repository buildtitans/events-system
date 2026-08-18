import { AppSearchService } from "@/src/lib/store/services/search/appSearchService";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const makeClient = ({
  searchEvents = jest.fn(),
  searchGroups = jest.fn(),
  suggestEvents = jest.fn(),
  suggestGroups = jest.fn(),
} = {}) =>
  ({
    events: {
      select: {
        search: { query: searchEvents },
        suggest: { query: suggestEvents },
      },
    },
    groups: {
      select: {
        search: { query: searchGroups },
        suggest: { query: suggestGroups },
      },
    },
  }) as unknown as TrpcClientType;

describe("AppSearchService", () => {
  it("queries both suggestion endpoints and compiles suggestion options", async () => {
    const query = "react";
    const storedGroups = [
      { id: "group-1", slug: "react-community" } as GroupSchemaType,
    ];
    const events = [
      {
        id: "event-1",
        group_id: "group-1",
        title: "React Night",
      } as EventSchemaType,
    ];
    const groups = [
      {
        id: "group-2",
        slug: "react-developers",
        name: "React Developers",
      } as GroupSchemaType,
    ];
    const suggestEvents = jest.fn().mockResolvedValue(events);
    const suggestGroups = jest.fn().mockResolvedValue(groups);
    const service = new AppSearchService(
      makeClient({ suggestEvents, suggestGroups }),
    );

    await expect(service.suggestions(query, storedGroups)).resolves.toEqual([
      {
        kind: "event",
        label: "Event: \n React Night",
        event_id: "event-1",
        group_id: "group-1",
        slug: "react-community",
      },
      {
        kind: "group",
        label: "Group: \n React Developers",
        group_id: "group-2",
        slug: "react-developers",
      },
    ]);
    expect(suggestEvents).toHaveBeenCalledWith(query);
    expect(suggestGroups).toHaveBeenCalledWith(query);
  });

  it("queries both search endpoints and returns compiled full results", async () => {
    const query = "react";
    const event = {
      id: "event-1",
      group_id: "group-1",
      title: "React Night",
    } as EventSchemaType;
    const group = {
      id: "group-1",
      slug: "react-community",
      name: "React",
    } as GroupSchemaType;
    const searchEvents = jest.fn().mockResolvedValue([event]);
    const searchGroups = jest.fn().mockResolvedValue([group]);
    const service = new AppSearchService(
      makeClient({ searchEvents, searchGroups }),
    );

    await expect(service.search(query)).resolves.toEqual([
      { kind: "group", data: group },
      { kind: "event", data: event },
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

    await expect(service.suggestions("react", [])).rejects.toBe(error);
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
