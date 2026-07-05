import { EventService } from "@/src/server/core/service/services/EventService";
import type {
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  createMockDb,
  policyMock,
  makeEvent,
  makeAttendanceUpdate,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("EventService.layout.active", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let getEvents: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    db = createMockDb();
    getEvents = db.events.select.allScheduled as jest.Mock;
    service = new EventService(db, policyMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns only events scheduled after now", async () => {
    const pastEvent = makeEvent({
      id: "past-1",
      starts_at: "2026-04-01T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
    });
    const futureEventOne = makeEvent({
      id: "future-1",
      starts_at: "2026-04-08T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
    });
    const futureEventTwo = makeEvent({
      id: "future-2",
      starts_at: "2026-04-12T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-12T12:00:00.000Z").getTime(),
    });

    getEvents.mockResolvedValue([pastEvent, futureEventOne, futureEventTwo]);

    await expect(service.layout.active()).resolves.toEqual([
      [
        {
          kind: "card",
          variant: {
            type: "hero",
            size: { xs: 12, md: 6 },
          },
          event: futureEventOne,
        },
        {
          kind: "card",
          variant: {
            type: "hero",
            size: { xs: 12, md: 6 },
          },
          event: futureEventTwo,
        },
      ],
    ]);

    expect(getEvents).toHaveBeenCalled();
  });

  it("returns an empty layout when every event is in the past or exactly now", async () => {
    const pastEvent = makeEvent({
      id: "past-1",
      starts_at: "2026-04-01T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
    });
    const nowEvent = makeEvent({
      id: "now-1",
      starts_at: "2026-04-06T00:00:00.000Z",
      starts_at_ms: new Date("2026-04-06T00:00:00.000Z").getTime(),
    });

    getEvents.mockResolvedValue([pastEvent, nowEvent]);

    await expect(service.layout.active()).resolves.toEqual([]);
  });
});

describe("EventService.timeline.getArchivedGroupEvents", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let getCancelledGroupEvents: jest.Mock;
  let getPastEventRecords: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getCancelledGroupEvents =
      db.events.select.cancelledByGroupId as jest.Mock;
    getPastEventRecords = db.eventAttendants.select.pastRecords as jest.Mock;
    service = new EventService(db, policyMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("throws an error if the user's role is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.timeline.getArchivedGroupEvents(undefined, crypto.randomUUID()),
    ).rejects.toThrow("401");

    expect(policyMock.requireOrganizer).not.toHaveBeenCalled();
  });

  it("throws an error if the user's role is not 'organizer'", async () => {
    authenticateAs();
    (policyMock.requireOrganizer as jest.Mock).mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.timeline.getArchivedGroupEvents("user-1", "group-2"),
    ).rejects.toThrow("403");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(policyMock.requireOrganizer).toHaveBeenCalledWith(
      "user-1",
      "group-2",
    );
    expect(getCancelledGroupEvents).not.toHaveBeenCalled();
  });

  it("returns archived events and their attendance lookup", async () => {
    authenticateAs();
    const archivedEvent = makeEvent({
      id: "archived-1",
      group_id: "group-1",
      status: "cancelled",
      starts_at: "2026-04-08T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
    });

    getCancelledGroupEvents.mockResolvedValue([archivedEvent]);
    getPastEventRecords.mockResolvedValue([
      makeAttendanceUpdate(
        { event_id: "archived-1", user_id: "user-1" },
        "going",
      ),
      makeAttendanceUpdate(
        { event_id: "archived-1", user_id: "user-2" },
        "going",
      ),
    ]);

    await expect(
      service.timeline.getArchivedGroupEvents("user-1", "group-1"),
    ).resolves.toEqual({
      archives: [archivedEvent],
      archivedAttendanceRecords: {
        "archived-1": 2,
      },
    });

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(policyMock.requireOrganizer).toHaveBeenCalledWith(
      "user-1",
      "group-1",
    );
    expect(getCancelledGroupEvents).toHaveBeenCalledWith("group-1");
    expect(getPastEventRecords).toHaveBeenCalledWith(["archived-1"]);
  });

  it("returns an empty archive payload when no archived events exist", async () => {
    authenticateAs();
    getCancelledGroupEvents.mockResolvedValue([]);

    await expect(
      service.timeline.getArchivedGroupEvents("user-1", "group-1"),
    ).resolves.toEqual({
      archives: [],
      archivedAttendanceRecords: {},
    });

    expect(getCancelledGroupEvents).toHaveBeenCalledWith("group-1");
    expect(getPastEventRecords).not.toHaveBeenCalled();
  });
});

describe("EventService.timeline.getPastEventsForGroup", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let getGroupEvents: jest.Mock;
  let getPastEventRecords: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    db = createMockDb();
    getGroupEvents = db.events.select.byGroupId as jest.Mock;
    getPastEventRecords = db.eventAttendants.select.pastRecords as jest.Mock;
    service = new EventService(db, policyMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns only events scheduled before now", async () => {
    const pastEvent = makeEvent({
      id: "past-1",
      group_id: "group-1",
      starts_at: "2026-04-01T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
    });
    const futureEvent = makeEvent({
      id: "future-1",
      group_id: "group-1",
      starts_at: "2026-04-08T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
    });

    getGroupEvents.mockResolvedValue([pastEvent, futureEvent]);

    getPastEventRecords.mockResolvedValue([
      makeAttendanceUpdate({ event_id: "past-1", user_id: "user-1" }, "going"),
      makeAttendanceUpdate({ event_id: "past-1", user_id: "user-2" }, "going"),
      makeAttendanceUpdate(
        { event_id: "future-1", user_id: "user-3" },
        "interested",
      ),
    ]);

    const result = await service.timeline.getPastEventsForGroup("group-1");

    expect(result).toEqual({
      history: [pastEvent],
      pastEventsRecords: {
        "past-1": 2,
        "future-1": 0,
      },
    });

    expect(getGroupEvents).toHaveBeenCalledWith("group-1");
    expect(getPastEventRecords).toHaveBeenCalledWith(["past-1", "future-1"]);
  });

  it("returns an empty array when a group has no past events", async () => {
    getGroupEvents.mockResolvedValue([
      makeEvent({
        id: "future-1",
        group_id: "group-1",
        starts_at: "2026-04-08T12:00:00.000Z",
        starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
      }),
    ]);

    getPastEventRecords.mockResolvedValue([]);

    const result = await service.timeline.getPastEventsForGroup("group-1");

    expect(result).toEqual({
      history: [],
      pastEventsRecords: {
        "future-1": 0,
      },
    });
    expect(getPastEventRecords).toHaveBeenCalledWith(["future-1"]);
  });

  it("returns all events when every event in the group is in the past", async () => {
    const olderPastEvent = makeEvent({
      id: "past-1",
      group_id: "group-1",
      starts_at: "2026-03-20T12:00:00.000Z",
      starts_at_ms: new Date("2026-03-20T12:00:00.000Z").getTime(),
    });
    const recentPastEvent = makeEvent({
      id: "past-2",
      group_id: "group-1",
      starts_at: "2026-04-05T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-05T12:00:00.000Z").getTime(),
    });

    getGroupEvents.mockResolvedValue([olderPastEvent, recentPastEvent]);
    getPastEventRecords.mockResolvedValue([
      makeAttendanceUpdate({ event_id: "past-1", user_id: "user-1" }, "going"),
      makeAttendanceUpdate({ event_id: "past-2", user_id: "user-2" }, "going"),
      makeAttendanceUpdate({ event_id: "past-2", user_id: "user-3" }, "going"),
    ]);

    const result = await service.timeline.getPastEventsForGroup("group-1");

    expect(result).toEqual({
      history: [olderPastEvent, recentPastEvent],
      pastEventsRecords: {
        "past-1": 1,
        "past-2": 2,
      },
    });
    expect(getPastEventRecords).toHaveBeenCalledWith(["past-1", "past-2"]);
  });
});

describe("EventService.timeline.getNextEventMap", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let getEventsByGroupIds: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-01T00:00:00.000Z"));
    db = createMockDb();
    getEventsByGroupIds = db.events.select.byGroupIds as jest.Mock;
    service = new EventService(db, policyMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns an empty lookup when no events are found", async () => {
    getEventsByGroupIds.mockResolvedValue([]);

    const result = await service.timeline.getNextEventMap(["group-1"]);

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

    const result = await service.timeline.getNextEventMap(["group-1"]);

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

    const result = await service.timeline.getNextEventMap(["group-1"]);

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

    const result = await service.timeline.getNextEventMap([
      "group-1",
      "group-2",
    ]);

    expect(result).toEqual({
      "group-1": "2026-04-08T12:00:00.000Z",
      "group-2": "2026-03-28T12:00:00.000Z",
    });
  });
});

describe("EventService.lifecycle.updateEventStatus", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let updateEventStatusInDb: jest.Mock;

  const eventUpdate = {
    organizer_id: "organizer-1",
    group_id: "group-1",
    event_id: "event-1",
    status: "cancelled",
  } satisfies UpdateEventArgsSchemaType;

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    updateEventStatusInDb = db.events.write.update as jest.Mock;
    service = new EventService(db, policyMock);
  });

  it("throws a 401 status error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.lifecycle.updateEventStatus(null, eventUpdate),
    ).rejects.toThrow("401");

    expect(policyMock.requireOrganizer).not.toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 status error when the user is not authorized to manage the group", async () => {
    authenticateAs();
    (policyMock.requireOrganizer as jest.Mock).mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.lifecycle.updateEventStatus("user-1", eventUpdate),
    ).rejects.toThrow("403");

    expect(policyMock.requireOrganizer).toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("updates the event status", async () => {
    authenticateAs();
    (policyMock.requireOrganizer as jest.Mock).mockImplementation(() => {});
    updateEventStatusInDb.mockResolvedValue({ updateStatus: "success" });

    await expect(
      service.lifecycle.updateEventStatus("user-1", eventUpdate),
    ).resolves.toEqual({ updateStatus: "success" });

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith("user-1");
    expect(policyMock.requireOrganizer).toHaveBeenCalledWith(
      "user-1",
      "group-1",
    );
    expect(updateEventStatusInDb).toHaveBeenCalledWith(eventUpdate);
  });
});

describe("EventService.lifecycle.createEvent", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let createNewEventInDb: jest.Mock;

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
    db = createMockDb();
    createNewEventInDb = db.events.write.create as jest.Mock;
    service = new EventService(db, policyMock);
  });

  it("throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.lifecycle.createEvent(createEventInput, groupId, undefined),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
    expect(policyMock.requireOrganizer).not.toHaveBeenCalled();
    expect(createNewEventInDb).not.toHaveBeenCalled();
  });

  it("throws a 403 error when the user is not allowed to create an event for the group", async () => {
    authenticateAs();
    (policyMock.requireOrganizer as jest.Mock).mockImplementation(() => {
      throw new Error("403");
    });

    await expect(
      service.lifecycle.createEvent(createEventInput, groupId, "user-1"),
    ).rejects.toThrow("403");

    expect(policyMock.requireOrganizer).toHaveBeenCalledWith("user-1", groupId);
    expect(createNewEventInDb).not.toHaveBeenCalled();
  });

  it("creates an event when the user is authenticated and authorized", async () => {
    authenticateAs();
    (policyMock.requireOrganizer as jest.Mock).mockResolvedValue(undefined);

    const createdEvent = makeEvent({
      group_id: groupId,
      title: createEventInput.title,
    });
    createNewEventInDb.mockResolvedValue(createdEvent);

    await expect(
      service.lifecycle.createEvent(createEventInput, groupId, "user-1"),
    ).resolves.toEqual({ ok: true, data: createdEvent });

    expect(policyMock.requireOrganizer).toHaveBeenCalledWith("user-1", groupId);
    expect(createNewEventInDb).toHaveBeenCalledWith(createEventInput);
  });
});
