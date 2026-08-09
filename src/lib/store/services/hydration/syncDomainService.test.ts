import { SyncDomainsService } from "@/src/lib/store/services/hydration/syncDomainService";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const clientWith = (results: {
  events: unknown;
  groups: unknown;
  categories: unknown;
  names: unknown;
}) =>
  ({
    events: { layout: { allActive: { query: jest.fn(() => results.events) } } },
    groups: {
      select: { all: { query: jest.fn(() => results.groups) } },
      lookup: { groupNames: { query: jest.fn(() => results.names) } },
    },
    categories: {
      getAllCategories: { query: jest.fn(() => results.categories) },
    },
  }) as unknown as TrpcClientType;

describe("SyncDomainsService", () => {
  it("combines fulfilled domain queries", async () => {
    const data = {
      events: [[{ id: "event-1" }]],
      groups: [{ id: "group-1" }],
      categories: [{ id: "category-1" }],
      groupNameDictionary: { "group-1": { name: "Group" } },
    };
    const service = new SyncDomainsService(
      clientWith({
        events: Promise.resolve(data.events),
        groups: Promise.resolve(data.groups),
        categories: Promise.resolve(data.categories),
        names: Promise.resolve(data.groupNameDictionary),
      }),
    );

    await expect(service.sync()).resolves.toEqual({ status: "fulfilled", data });
  });

  it("uses empty fallbacks for individual rejected domains", async () => {
    const groups = [{ id: "group-1" }];
    const service = new SyncDomainsService(
      clientWith({
        events: Promise.reject(new Error("events")),
        groups: Promise.resolve(groups),
        categories: Promise.reject(new Error("categories")),
        names: Promise.reject(new Error("names")),
      }),
    );

    await expect(service.sync()).resolves.toEqual({
      status: "fulfilled",
      data: { events: [], groups, categories: [], groupNameDictionary: {} },
    });
  });

  it("fails when every domain query rejects", async () => {
    const rejected = () => Promise.reject(new Error("offline"));
    const service = new SyncDomainsService(
      clientWith({
        events: rejected(),
        groups: rejected(),
        categories: rejected(),
        names: rejected(),
      }),
    );

    await expect(service.sync()).resolves.toEqual({
      status: "rejected",
      error: "Domain init failed",
    });
  });
});
