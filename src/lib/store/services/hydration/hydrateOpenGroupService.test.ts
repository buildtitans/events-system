import { HydrateOpenGroupService } from "./hydrateOpenGroupService";
import type { TrpcClientType } from "@/src/trpc/trpcClient";
import { makeHydratedGroup, makeNextEvent } from "./groupHydration.fixtures";

function setup(hydrated = makeHydratedGroup()) {
  const groupQuery = jest.fn().mockResolvedValue(hydrated);
  const roleQuery = jest.fn().mockResolvedValue("member");
  const layoutQuery = jest.fn().mockResolvedValue([]);
  const calendarQuery = jest.fn().mockResolvedValue([]);
  const client = {
    hydrate: {
      groups: { single: { query: groupQuery } },
      events: { layouts: { forGroup: { query: layoutQuery } } },
    },
    entities: {
      group: {
        events: { list: { query: calendarQuery } },
        member: { role: { query: roleQuery } },
      },
    },
  } as unknown as TrpcClientType;
  return { service: new HydrateOpenGroupService(client), groupQuery, roleQuery, layoutQuery, calendarQuery };
}

describe("HydrateOpenGroupService", () => {
  it("combines hydrated metadata with role, layout, and calendar", async () => {
    const hydrated = makeHydratedGroup({ next_event: makeNextEvent() });
    const { service, groupQuery, roleQuery, layoutQuery, calendarQuery } = setup(hydrated);
    const calendar = [makeNextEvent()];
    calendarQuery.mockResolvedValue(calendar);
    await expect(service.hydrate(hydrated.group.slug)).resolves.toEqual({
      ok: true, data: { hydrated, role: "member", layout: [], calandar: calendar },
    });
    expect(groupQuery).toHaveBeenCalledWith(hydrated.group.slug);
    for (const query of [roleQuery, layoutQuery, calendarQuery]) {
      expect(query).toHaveBeenCalledWith(hydrated.group.id);
    }
  });

  it("preserves a valid group without a next event", async () => {
    const hydrated = makeHydratedGroup();
    const { service } = setup(hydrated);
    await expect(service.hydrate(hydrated.group.slug)).resolves.toMatchObject({
      ok: true, data: { hydrated },
    });
  });

  it.each(["group", "calendar"])("returns failure when the %s request rejects", async (request) => {
    const { service, groupQuery, calendarQuery, roleQuery } = setup();
    const log = jest.spyOn(console, "error").mockImplementation(() => undefined);
    (request === "group" ? groupQuery : calendarQuery).mockRejectedValue(new Error("unavailable"));
    try {
      await expect(service.hydrate("group-one")).resolves.toEqual({
        ok: false, error: "Failed to hydrate group selected",
      });
      if (request === "group") expect(roleQuery).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
