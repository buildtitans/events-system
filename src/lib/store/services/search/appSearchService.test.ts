import { AppSearchService } from "@/src/lib/store/services/search/appSearchService";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

describe("AppSearchService", () => {
  it("queries events and groups and compiles their suggestions", async () => {
    const query = "react";
    const storedGroups = [
      { id: "group-1", slug: "react-community" } as GroupSchemaType,
    ];
    const events = [
      { id: "event-1", group_id: "group-1", title: "React Night" } as EventSchemaType,
    ];
    const groups = [
      { id: "group-1", slug: "react-community", name: "React Community" } as GroupSchemaType,
    ];
    const searchEvents = jest.fn().mockResolvedValue(events);
    const searchGroups = jest.fn().mockResolvedValue(groups);
    const service = new AppSearchService({
      events: { select: { search: { query: searchEvents } } },
      groups: { select: { search: { query: searchGroups } } },
    } as unknown as TrpcClientType);

    await expect(service.search(query, storedGroups)).resolves.toHaveLength(2);
    expect(searchEvents).toHaveBeenCalledWith(query);
    expect(searchGroups).toHaveBeenCalledWith(query);
  });
});
