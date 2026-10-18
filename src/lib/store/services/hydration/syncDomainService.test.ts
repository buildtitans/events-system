import { SyncDomainsService } from "@/src/lib/store/services/hydration/syncDomainService";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const clientWith = (results: {
  events: () => Promise<unknown>;
  groups: () => Promise<unknown>;
  categories: () => Promise<unknown>;
}) =>
  ({
    layouts: { events: { discovery: { query: jest.fn(results.events) } } },
    groups: {
      read: { select: { list: { query: jest.fn(results.groups) } } },
    },
    categories: {
      getAllCategories: { query: jest.fn(results.categories) },
    },
  }) as unknown as TrpcClientType;

describe("SyncDomainsService", () => {
  it("combines fulfilled domain queries", async () => {
    const data = {
      events: [[{ id: "event-1" }]],
      groups: [{ id: "group-1" }],
      categories: [{ id: "category-1" }],
    };
    const service = new SyncDomainsService(
      clientWith({
        events: () => Promise.resolve(data.events),
        groups: () => Promise.resolve(data.groups),
        categories: () => Promise.resolve(data.categories),
      }),
    );

    await expect(service.sync()).resolves.toEqual({ status: "fulfilled", data });
  });

  it("uses empty fallbacks for individual rejected domains", async () => {
    const groups = [{ id: "group-1" }];
    const service = new SyncDomainsService(
      clientWith({
        events: () => Promise.reject(new Error("events")),
        groups: () => Promise.resolve(groups),
        categories: () => Promise.reject(new Error("categories")),
      }),
    );

    await expect(service.sync()).resolves.toEqual({
      status: "fulfilled",
      data: { events: [], groups, categories: [] },
    });
  });

  it("fails when every domain query rejects", async () => {
    const rejected = () => Promise.reject(new Error("offline"));
    const service = new SyncDomainsService(
      clientWith({
        events: rejected,
        groups: rejected,
        categories: rejected,
      }),
    );

    await expect(service.sync()).resolves.toEqual({
      status: "rejected",
      error: "Domain init failed",
    });
  });
});
