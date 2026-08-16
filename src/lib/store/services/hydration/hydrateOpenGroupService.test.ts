import { HydrateOpenGroupService } from "@/src/lib/store/services/hydration/hydrateOpenGroupService";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

describe("HydrateOpenGroupService", () => {
  const group = {
    id: "group-1",
    slug: "group-one",
    category_id: "category-1",
  };
  const calandar = [{ id: "event-1" }];
  const nextEvent = { id: "event-2" };
  const category = {
    id: "category-1",
    name: "Technology",
    slug: "technology",
    icon: "computer",
  };
  const members = [{ user_id: "user-1" }, { user_id: "user-2" }];
  const nextEventQuery = jest.fn().mockResolvedValue(nextEvent);
  const categoryByIdQuery = jest.fn().mockResolvedValue(category);
  const client = {
    groups: {
      select: {
        bySlug: { query: jest.fn().mockResolvedValue(group) },
        categoryById: { query: categoryByIdQuery },
      },
    },
    groupMembers: {
      select: {
        role: { query: jest.fn().mockResolvedValue("member") },
        forGroup: { query: jest.fn().mockResolvedValue(members) },
        organizerEmail: {
          query: jest
            .fn()
            .mockResolvedValue({ email: "organizer@example.com" }),
        },
      },
    },
    events: {
      layout: { forGroup: { query: jest.fn().mockResolvedValue(null) } },
      select: {
        forGroup: { query: jest.fn().mockResolvedValue(calandar) },
        nextEventForGroup: { query: nextEventQuery },
      },
    },
  } as unknown as TrpcClientType;
  const service = new HydrateOpenGroupService(client);
  it("combines a group with its metadata", async () => {
    await expect(service.hydrate("group-one")).resolves.toEqual({
      ok: true,
      data: {
        group,
        role: "member",
        layout: [],
        calandar,
        numMembers: 2,
        organizerEmail: "organizer@example.com",
        nextEvent,
        category,
      },
    });
    expect(client.groupMembers.select.role.query).toHaveBeenCalledWith(
      "group-1",
    );
    expect(nextEventQuery).toHaveBeenCalledWith("group-1");
    expect(categoryByIdQuery).toHaveBeenCalledWith("category-1");
  });

  it("preserves missing optional next-event and category metadata", async () => {
    nextEventQuery.mockResolvedValueOnce(undefined);
    categoryByIdQuery.mockResolvedValueOnce(undefined);

    await expect(service.hydrate("group-one")).resolves.toEqual({
      ok: true,
      data: {
        group,
        role: "member",
        layout: [],
        calandar,
        numMembers: 2,
        organizerEmail: "organizer@example.com",
        nextEvent: undefined,
        category: undefined,
      },
    });
  });

  it("returns a failure payload when the group cannot be found", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const service = new HydrateOpenGroupService({
      groups: {
        select: {
          bySlug: {
            query: jest.fn().mockResolvedValue(null),
          },
        },
      },
    } as unknown as TrpcClientType);

    try {
      await expect(service.hydrate("missing")).resolves.toEqual({
        ok: false,
        error: "Failed to hydrate group selected",
      });

      expect(consoleError).toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });
});
