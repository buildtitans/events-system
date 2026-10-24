import { GroupsSelector } from "./groupsSelector";
import { GroupsValidator } from "./groupsValidator";
import { EventsValidator } from "../events/eventsValidator";
import type { IGroupsReader } from "./rawGroupsReader";

function setup() {
  const read = {
    timeline: jest.fn<ReturnType<IGroupsReader["timeline"]>, Parameters<IGroupsReader["timeline"]>>(),
    history: jest.fn(),
    allGroups: jest.fn(),
    hydrateGroup: jest.fn(),
    popularGroups: jest.fn(),
    archivedEventsWithAttendance: jest.fn(),
    search: jest.fn(),
    suggestions: jest.fn(),
    byCategoryId: jest.fn(),
    byOrganizerId: jest.fn(),
  } satisfies IGroupsReader;
  const selector = new GroupsSelector(read, new GroupsValidator(new EventsValidator()));
  return { read, selector };
}

describe("GroupsSelector.timeline", () => {
  it("awaits the reader before validating an empty timeline", async () => {
    const { read, selector } = setup();
    read.timeline.mockResolvedValue([]);
    await expect(selector.timeline("group-1")).resolves.toEqual([]);
    expect(read.timeline).toHaveBeenCalledWith("group-1");
  });

  it("propagates a database failure", async () => {
    const { read, selector } = setup();
    const error = new Error("database unavailable");
    read.timeline.mockRejectedValue(error);
    await expect(selector.timeline("group-1")).rejects.toBe(error);
  });

  it("rejects malformed reader output at the schema boundary", async () => {
    const { read, selector } = setup();
    read.timeline.mockResolvedValue([{
      timeline_status: "today",
      event_phase: "ongoing",
      event: {
        id: "event-1",
        starts_at: "invalid-date",
        starts_at_ms: 0,
        created_at: "2026-08-01T12:00:00.000Z",
        image: "event.jpg",
      },
    }]);
    await expect(selector.timeline("group-1")).rejects.toThrow("Invalid Schema");
  });
});
