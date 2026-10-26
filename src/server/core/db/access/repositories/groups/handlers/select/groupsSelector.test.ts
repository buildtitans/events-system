import { EventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";
import type { IGroupsReader } from "../read/groupsReader";
import { GroupsValidator } from "../validate/groupsValidator";
import { GroupsSelector } from "./groupsSelector";

function setup() {
  const read = {
    hydrate: {
      single: jest.fn(),
      refreshGroup: jest.fn(),
      list: {
        all: jest.fn(),
        popular: jest.fn(),
        byCategoryId: jest.fn(),
        byOrganizerId: jest.fn(),
      },
    },
    query: {
      timeline: jest.fn<
        ReturnType<IGroupsReader["query"]["timeline"]>,
        Parameters<IGroupsReader["query"]["timeline"]>
      >(),
      history: jest.fn(),
      archivedEventsWithAttendance: jest.fn(),
      search: jest.fn(),
      suggest: jest.fn(),
    },
  } satisfies IGroupsReader;
  const selector = new GroupsSelector(
    read,
    new GroupsValidator(new EventsValidator()),
  );
  return { read, selector };
}

describe("GroupsSelector.timeline", () => {
  it("awaits the reader before validating an empty timeline", async () => {
    const { read, selector } = setup();
    read.query.timeline.mockResolvedValue([]);
    await expect(selector.query.timeline("group-1")).resolves.toEqual([]);
    expect(read.query.timeline).toHaveBeenCalledWith("group-1");
  });

  it("propagates a database failure", async () => {
    const { read, selector } = setup();
    const error = new Error("database unavailable");
    read.query.timeline.mockRejectedValue(error);
    await expect(selector.query.timeline("group-1")).rejects.toBe(error);
  });

  it("rejects malformed reader output at the schema boundary", async () => {
    const { read, selector } = setup();
    read.query.timeline.mockResolvedValue([
      {
        timeline_status: "today",
        event_phase: "ongoing",
        event: {
          id: "event-1",
          starts_at: "invalid-date",
          starts_at_ms: 0,
          created_at: "2026-08-01T12:00:00.000Z",
          image: "event.jpg",
        },
      },
    ]);
    await expect(selector.query.timeline("group-1")).rejects.toThrow(
      "Invalid Schema",
    );
  });
});

describe("GroupsSelector branches", () => {
  it("validates discovery lists from the matching reader branch", async () => {
    const { read, selector } = setup();
    read.hydrate.list.all.mockResolvedValue([]);
    await expect(selector.view.list.all()).resolves.toEqual([]);
    expect(read.hydrate.list.all).toHaveBeenCalledTimes(1);
    read.hydrate.list.all.mockResolvedValue([{}]);
    await expect(selector.view.list.all()).rejects.toThrow("Invalid Schema");
  });

  it("passes viewer context to the single-group read and rejects malformed output", async () => {
    const { read, selector } = setup();
    read.hydrate.single.mockResolvedValue({});
    await expect(selector.view.single("community")).rejects.toThrow(
      "Invalid Schema",
    );
    expect(read.hydrate.single).toHaveBeenCalledWith("community", undefined);
  });

  it("validates query results separately from view reads", async () => {
    const { read, selector } = setup();
    read.query.search.mockResolvedValue([]);
    await expect(selector.query.search("react")).resolves.toEqual([]);
    expect(read.query.search).toHaveBeenCalledWith("react");
    expect(read.hydrate.list.all).not.toHaveBeenCalled();
  });
});

describe("GroupsSelector.view.refresh", () => {
  it("validates empty event data while retaining the refresh response", async () => {
    const { read, selector } = setup();
    const result = { group_events: [], calandar: [] };
    read.hydrate.refreshGroup.mockResolvedValue(result);
    await expect(selector.view.refresh("group-1")).resolves.toEqual(result);
    expect(read.hydrate.refreshGroup).toHaveBeenCalledWith("group-1");
  });

  it("rejects an invalid refresh payload", async () => {
    const { read, selector } = setup();
    read.hydrate.refreshGroup.mockResolvedValue({ group_events: [], calandar: "invalid" });
    await expect(selector.view.refresh("group-1")).rejects.toThrow("Invalid Schema");
  });
});
