import { EventService } from "@/src/server/core/service/services/EventService";
import type {
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  dbMock,
  policyMock,
  makeEvent,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("EventsService.getNextEventLookupMap", () => {
  const getEventsByGroupIds = dbMock.events.getEventsByGroupIds as jest.Mock;
  let service: EventService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-01T00:00:00.000Z"));
    service = new EventService(dbMock, policyMock);
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
  const updateEventStatusInDb = dbMock.events.updateEventStatus as jest.Mock;

  let service: EventService;

  const eventUpdate = {
    organizer_id: "organizer-1",
    group_id: "group-1",
    event_id: "event-1",
    status: "cancelled",
  } satisfies UpdateEventArgsSchemaType;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EventService(dbMock, policyMock);
  });

  it("throws a 401 status error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.updateEventStatus(null, eventUpdate)).rejects.toThrow(
      "401",
    );

    expect(policyMock.requireCanManageGroup).not.toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 status error when the user is not authorized to manage the group", async () => {
    authenticateAs();
    (policyMock.requireCanManageGroup as jest.Mock).mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.updateEventStatus("user-1", eventUpdate),
    ).rejects.toThrow("403");

    expect(policyMock.requireCanManageGroup).toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("updates the event status", async () => {
    authenticateAs();
    (policyMock.requireCanManageGroup as jest.Mock).mockImplementation(
      () => {},
    );
    updateEventStatusInDb.mockResolvedValue({ status: eventUpdate.status });

    await expect(
      service.updateEventStatus("user-1", eventUpdate),
    ).resolves.toEqual({ status: eventUpdate.status });

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(policyMock.requireCanManageGroup).toHaveBeenCalledWith(
      "user-1",
      "group-1",
    );
    expect(updateEventStatusInDb).toHaveBeenCalledWith(eventUpdate);
  });
});

describe("EventService.createEvent", () => {
  const createNewEventInDb = dbMock.events.createNewEvent as jest.Mock;

  let service: EventService;

  const groupId = "group-1";

  const createEventInput: NewEventInputSchemaType = {
    group_id: groupId,
    starts_at: "2026-04-15T17:30:00.000Z",
    img: "https://picsum.photos/800/450?random=3",
    tag: "Design",
    title: "Design Trends Worth Paying Attention To in 2026",
    description:
      "A conversation for designers and frontend folks about emerging design trends, interface patterns, and how to build experiences that stay relevant over time.",
    meeting_location: "Online",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new EventService(dbMock, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.createEvent(createEventInput, groupId, undefined),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
    expect(policyMock.requireCanCreateEvent).not.toHaveBeenCalled();
    expect(createNewEventInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 error when the user is not allowed to create an event for the group", async () => {
    authenticateAs();
    (policyMock.requireCanCreateEvent as jest.Mock).mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.createEvent(createEventInput, groupId, "user-1"),
    ).rejects.toThrow("403");

    expect(policyMock.requireCanCreateEvent).toHaveBeenCalledWith(
      "user-1",
      groupId,
    );
    expect(createNewEventInDb).not.toHaveBeenCalled();
  });

  it("creates an event when the user is authenticated and authorized", async () => {
    authenticateAs();
    (policyMock.requireCanCreateEvent as jest.Mock).mockResolvedValue(
      undefined,
    );

    const createdEvent = makeEvent({
      group_id: groupId,
      title: createEventInput.title,
    });
    createNewEventInDb.mockResolvedValue(createdEvent);

    await expect(
      service.createEvent(createEventInput, groupId, "user-1"),
    ).resolves.toEqual(createdEvent);

    expect(policyMock.requireCanCreateEvent).toHaveBeenCalledWith(
      "user-1",
      groupId,
    );
    expect(createNewEventInDb).toHaveBeenCalledWith(createEventInput);
  });
});
