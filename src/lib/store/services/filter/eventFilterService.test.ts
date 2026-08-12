import { EventFilterService } from "@/src/lib/store/services/filter/eventFilterService";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const asClient = (value: unknown) => value as TrpcClientType;

describe("EventFilterService", () => {
  it("returns the active event layout", async () => {
    const events = [[{ id: "event-1" }]];
    const query = jest.fn().mockResolvedValue(events);
    const service = new EventFilterService(
      asClient({ events: { layout: { allActive: { query } } } }),
    );

    await expect(service.all()).resolves.toEqual({ ok: true, events });
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("gets layouts for the popular event ids", async () => {
    const ids = ["event-1", "event-2"];
    const events = [[{ id: "event-1" }]];
    const popular = jest.fn().mockResolvedValue(ids);
    const byIds = jest.fn().mockResolvedValue(events);
    const service = new EventFilterService(
      asClient({
        eventAttendants: { select: { popular: { query: popular } } },
        events: { layout: { byIds: { query: byIds } } },
      }),
    );

    await expect(service.popular()).resolves.toEqual({ ok: true, events });
    expect(byIds).toHaveBeenCalledWith(ids);
  });

  it("only requests events occurring in the next 30 days", async () => {
    const now = Date.UTC(2026, 7, 9);
    jest.spyOn(Date, "now").mockReturnValue(now);
    const event = (id: string, starts_at_ms: number) =>
      ({ id, starts_at_ms }) as EventSchemaType;
    const allEvents = [
      event("past", now - 1),
      event("now", now),
      event("inside", now + 15 * 24 * 60 * 60 * 1000),
      event("boundary", now + 30 * 24 * 60 * 60 * 1000),
      event("later", now + 31 * 24 * 60 * 60 * 1000),
    ];
    const all = jest.fn().mockResolvedValue(allEvents);
    const byIds = jest.fn().mockResolvedValue([]);
    const service = new EventFilterService(
      asClient({
        events: {
          select: { all: { query: all } },
          layout: { byIds: { query: byIds } },
        },
      }),
    );

    await expect(service.upcoming()).resolves.toEqual({ ok: true, events: [] });
    expect(byIds).toHaveBeenCalledWith(["now", "inside", "boundary"]);
  });

  it("returns a failure result when a filter query rejects", async () => {
    const service = new EventFilterService(
      asClient({
        events: {
          layout: { allActive: { query: jest.fn().mockRejectedValue(new Error("nope")) } },
        },
      }),
    );

    await expect(service.all()).resolves.toEqual({
      ok: false,
      error: "Failed to retrieve all active events layout",
    });
  });
});
