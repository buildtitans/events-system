import { EventService } from "@/src/server/core/service/services/EventService";
import type {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

function makeEvent(overrides: Partial<EventSchemaType> = {}): EventSchemaType {
  return {
    id: "306fbc60-5ac6-4a95-8df9-89a110588000",
    img: "https://picsum.photos/800/450?random=3",
    tag: "Design",
    title: "Design Trends Worth Paying Attention To in 2026",
    description:
      "A conversation for designers and frontend folks about emerging design trends, interface patterns, and how to build experiences that stay relevant over time.",
    starts_at_ms: new Date("2026-04-15T17:30:00.000Z").getTime(),
    starts_at: "2026-04-15T17:30:00.000Z",
    meeting_location: "Online",
    group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    status: "scheduled",
    ...overrides,
  };
}

describe("EventsService.getNextEventLookupMap", () => {
  const getEventsByGroupIds = jest.fn();

  const db = {
    events: {
      getEventsByGroupIds,
    },
  } as unknown as DBClient;

  const policy = {} as Authorization;

  let service: EventService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-01T00:00:00.000Z"));
    service = new EventService(db, policy);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns an empty lookup when no events are found", async () => {
    getEventsByGroupIds.mockResolvedValue([]);

    const result = await service.getNextEventLookupMap(["group-1"]);

    expect(result).toEqual({});
    expect(getEventsByGroupIds).toHaveBeenCalledWith(["group-1"]);
  });

  it("returns the nearest future event when a group has both past and future events", async () => {
    getEventsByGroupIds.mockResolvedValue([
      makeEvent({
        id: "past-1",
        group_id: "group-1",
        starts_at: "2026-03-20T12:00:00.000Z",
        starts_at_ms: new Date("2026-03-20T12:00:00.000Z").getTime(),
      }),
      makeEvent({
        id: "future-later",
        group_id: "group-1",
        starts_at: "2026-04-20T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-20T12:00:00.000Z").getTime(),
      }),
      makeEvent({
        id: "future-sooner",
        group_id: "group-1",
        starts_at: "2026-04-05T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-05T12:00:00.000Z").getTime(),
      }),
    ]);

    const result = await service.getNextEventLookupMap(["group-1"]);

    expect(result).toEqual({
      "group-1": "2026-04-05T12:00:00.000Z",
    });
  });

  it("returns the most recent past event when a group has no future events", async () => {
    getEventsByGroupIds.mockResolvedValue([
      makeEvent({
        id: "older-past",
        group_id: "group-1",
        starts_at: "2026-03-01T12:00:00.000Z",
        starts_at_ms: new Date("2026-03-01T12:00:00.000Z").getTime(),
      }),
      makeEvent({
        id: "recent-past",
        group_id: "group-1",
        starts_at: "2026-03-30T12:00:00.000Z",
        starts_at_ms: new Date("2026-03-30T12:00:00.000Z").getTime(),
      }),
    ]);

    const result = await service.getNextEventLookupMap(["group-1"]);

    expect(result).toEqual({
      "group-1": "2026-03-30T12:00:00.000Z",
    });
  });

  it("builds the lookup independently for multiple groups", async () => {
    getEventsByGroupIds.mockResolvedValue([
      makeEvent({
        id: "g1-future",
        group_id: "group-1",
        starts_at: "2026-04-08T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
      }),
      makeEvent({
        id: "g2-past",
        group_id: "group-2",
        starts_at: "2026-03-28T12:00:00.000Z",
        starts_at_ms: new Date("2026-03-28T12:00:00.000Z").getTime(),
      }),
    ]);

    const result = await service.getNextEventLookupMap(["group-1", "group-2"]);

    expect(result).toEqual({
      "group-1": "2026-04-08T12:00:00.000Z",
      "group-2": "2026-03-28T12:00:00.000Z",
    });
  });
});

describe("EventsService.updateEventStatus", () => {
  const updateEventStatusInDb = jest.fn();

  const db = {
    events: {
      updateEventStatus: updateEventStatusInDb,
    },
  } as unknown as DBClient;

  const policy = {
    requireAuthenticated: jest.fn(),
    requireCanManageGroup: jest.fn(),
  } as unknown as Authorization;

  let service: EventService;

  const eventUpdate = {
    organizer_id: "organizer-1",
    group_id: "group-1",
    event_id: "event-1",
    status: "cancelled",
  } satisfies UpdateEventArgsSchemaType;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EventService(db, policy);
  });

  it("throws a 401 status error when the user is not authenticated", async () => {
    (policy.requireAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error("401");
    });

    await expect(service.updateEventStatus(null, eventUpdate)).rejects.toThrow(
      "401",
    );

    expect(policy.requireCanManageGroup).not.toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 status error when the user is not authorized to manage the group", async () => {
    (policy.requireAuthenticated as jest.Mock).mockReturnValue("user-1");
    (policy.requireCanManageGroup as jest.Mock).mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.updateEventStatus("user-1", eventUpdate),
    ).rejects.toThrow("403");

    expect(policy.requireCanManageGroup).toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("updates the event status", async () => {
    (policy.requireAuthenticated as jest.Mock).mockReturnValue("user-1");
    (policy.requireCanManageGroup as jest.Mock).mockImplementation(() => {});
    updateEventStatusInDb.mockResolvedValue({ status: eventUpdate.status });

    await expect(
      service.updateEventStatus("user-1", eventUpdate),
    ).resolves.toEqual({ status: eventUpdate.status });

    expect(policy.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(policy.requireCanManageGroup).toHaveBeenCalledWith(
      "user-1",
      "group-1",
    );
    expect(updateEventStatusInDb).toHaveBeenCalledWith(eventUpdate);
  });
});
