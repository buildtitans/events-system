import { EventFilterService } from "@/src/lib/store/services/filter/eventFilterService";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const asClient = (layouts: Partial<TrpcClientType["hydrate"]["events"]["layouts"]>) =>
  ({ hydrate: { events: { layouts } } }) as TrpcClientType;

describe("EventFilterService", () => {
  it("returns the active event layout", async () => {
    const events = [[{ id: "event-1" }]];
    const query = jest.fn().mockResolvedValue(events);
    const service = new EventFilterService(
      asClient({ discovery: { query } }),
    );

    await expect(service.all()).resolves.toEqual({ ok: true, events });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("returns the popular event layout", async () => {
    const events = [[{ id: "event-1" }]];
    const query = jest.fn().mockResolvedValue(events);
    const service = new EventFilterService(
      asClient({
        popular: { query },
      }),
    );

    await expect(service.popular()).resolves.toEqual({ ok: true, events });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("returns the upcoming event layout", async () => {
    const events = [[{ id: "event-1" }]];
    const query = jest.fn().mockResolvedValue(events);
    const service = new EventFilterService(
      asClient({
        upcoming: { query },
      }),
    );

    await expect(service.upcoming()).resolves.toEqual({ ok: true, events });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("returns a failure result when a filter query rejects", async () => {
    const service = new EventFilterService(
      asClient({
        discovery: { query: jest.fn().mockRejectedValue(new Error("nope")) },
      }),
    );

    await expect(service.all()).resolves.toEqual({
      ok: false,
      error: "Failed to retrieve all active events layout",
    });
  });
});
