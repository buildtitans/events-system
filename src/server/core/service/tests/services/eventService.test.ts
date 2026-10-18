import { USER_ID } from "../mockers/mockValues";
import { EventService } from "@/src/server/core/service/services/EventService";
import type {
  NewEventInputSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  createMockDb,
  policyMock,
  makeEvent,
  makeEventSummary,
  makeGroupEventSummary,
  makeAttendanceUpdate,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("EventService.layout.discovery", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let getEvents: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    db = createMockDb();
    getEvents = db.events.select.discovery as jest.Mock;
    service = new EventService(db, policyMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns only events scheduled after now", async () => {
    const pastEvent = makeEventSummary({
      id: "past-1",
      starts_at: "2026-04-01T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
    });
    const futureEventOne = makeEventSummary({
      id: "future-1",
      starts_at: "2026-04-08T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
    });
    const futureEventTwo = makeEventSummary({
      id: "future-2",
      starts_at: "2026-04-12T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-12T12:00:00.000Z").getTime(),
    });

    getEvents.mockResolvedValue([futureEventTwo, pastEvent, futureEventOne]);

    await expect(service.layout.discovery()).resolves.toEqual([
      [
        {
          kind: "card",
          variant: {
            type: "hero",
            size: { xs: 12, md: 6 },
          },
          event: { for: "discovery", content: futureEventOne },
        },
        {
          kind: "card",
          variant: {
            type: "hero",
            size: { xs: 12, md: 6 },
          },
          event: { for: "discovery", content: futureEventTwo },
        },
      ],
    ]);

    expect(getEvents).toHaveBeenCalled();
  });

  it("returns an empty layout when every event is in the past or exactly now", async () => {
    const pastEvent = makeEventSummary({
      id: "past-1",
      starts_at: "2026-04-01T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
    });
    const nowEvent = makeEventSummary({
      id: "now-1",
      starts_at: "2026-04-06T00:00:00.000Z",
      starts_at_ms: new Date("2026-04-06T00:00:00.000Z").getTime(),
    });

    getEvents.mockResolvedValue([pastEvent, nowEvent]);

    await expect(service.layout.discovery()).resolves.toEqual([]);
  });
});

describe("EventService summary consumers", () => {
  it("returns group event summaries for the calendar without discovery metadata", async () => {
    const db = createMockDb();
    const summary = makeGroupEventSummary();
    (db.events.select.byGroupId as jest.Mock).mockResolvedValue([summary]);
    const service = new EventService(db, policyMock);

    await expect(service.query.getGroupEvents("group-1")).resolves.toEqual([summary]);
    expect(db.events.select.byGroupId).toHaveBeenCalledWith("group-1");
  });

  it("skips the selector when a layout has no requested IDs", async () => {
    const db = createMockDb();
    const service = new EventService(db, policyMock);

    await expect(service.layout.byIds([])).resolves.toEqual([]);
    expect(db.events.select.byIds).not.toHaveBeenCalled();
  });

  it("excludes past events from group layouts", async () => {
    const db = createMockDb();
    const past = makeGroupEventSummary({ starts_at_ms: Date.now() - 60_000 });
    const future = makeGroupEventSummary({ starts_at_ms: Date.now() + 60_000 });
    (db.events.select.byGroupId as jest.Mock).mockResolvedValue([past, future]);
    const service = new EventService(db, policyMock);

    await expect(service.layout.forGroup("group-1")).resolves.toEqual([
      [{ kind: "card", variant: { type: "hero", size: { xs: 12, md: 6 } }, event: { for: "withinGroup", content: future } }],
    ]);
  });
});

describe("EventService.layout curated filters", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let getScheduledEvents: jest.Mock;
  let getEventsByIds: jest.Mock;
  let getAttendanceRecords: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    db = createMockDb();
    getScheduledEvents = db.events.select.allScheduled as jest.Mock;
    getEventsByIds = db.events.select.byIds as jest.Mock;
    getAttendanceRecords = db.eventAttendants.select.allRecords as jest.Mock;
    service = new EventService(db, policyMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("builds a layout from active events meeting the popularity threshold", async () => {
    const popularEvent = makeEvent({
      id: "active-popular",
      starts_at: "2026-04-08T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-08T12:00:00.000Z").getTime(),
    });
    const pastEvent = makeEvent({
      id: "past-popular",
      starts_at: "2026-04-01T12:00:00.000Z",
      starts_at_ms: new Date("2026-04-01T12:00:00.000Z").getTime(),
    });
    getScheduledEvents.mockResolvedValue([popularEvent, pastEvent]);
    getAttendanceRecords.mockResolvedValue([
      ...["user-1", "user-2", "user-3", "user-4"].map((user_id) =>
        makeAttendanceUpdate({ event_id: popularEvent.id, user_id }, "going"),
      ),
      ...["user-5", "user-6", "user-7", "user-8"].map((user_id) =>
        makeAttendanceUpdate({ event_id: pastEvent.id, user_id }, "going"),
      ),
    ]);
    getEventsByIds.mockResolvedValue([makeEventSummary(popularEvent)]);

    await expect(service.layout.popular()).resolves.toHaveLength(1);
    expect(getEventsByIds).toHaveBeenCalledWith([popularEvent.id]);
  });

  it("builds a layout from events occurring within the next 30 days", async () => {
    const now = Date.now();
    const event = (id: string, starts_at_ms: number) =>
      makeEvent({
        id,
        starts_at: new Date(starts_at_ms).toISOString(),
        starts_at_ms,
      });
    const events = [
      event("past", now - 1),
      event("now", now),
      event("inside", now + 15 * 24 * 60 * 60 * 1000),
      event("boundary", now + 30 * 24 * 60 * 60 * 1000),
      event("later", now + 31 * 24 * 60 * 60 * 1000),
    ];
    const upcomingEvents = [events[1], events[2], events[3]];
    getScheduledEvents.mockResolvedValue(events);
    getEventsByIds.mockResolvedValue(upcomingEvents.map((event) => makeEventSummary(event)));

    await expect(service.layout.upcoming()).resolves.toHaveLength(1);
    expect(getEventsByIds).toHaveBeenCalledWith([
      "now",
      "inside",
      "boundary",
    ]);
  });
});

describe("EventService.timeline.getPastEventsForGroup", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    db = createMockDb();
    service = new EventService(db, policyMock);
  });

  afterEach(() => jest.useRealTimers());

  it("returns past summaries with their included going counts in chronological order", async () => {
    const older = makeGroupEventSummary(
      { id: "past-1", starts_at_ms: Date.parse("2026-03-20T12:00:00.000Z") },
      { attendance: { going: 0, interested: 3 } },
    );
    const recent = makeGroupEventSummary(
      { id: "past-2", starts_at_ms: Date.parse("2026-04-05T12:00:00.000Z") },
      { attendance: { going: 2, interested: 4 } },
    );
    const future = makeGroupEventSummary({ id: "future", starts_at_ms: Date.now() + 1 });
    const now = makeGroupEventSummary({ id: "now", starts_at_ms: Date.now() });
    (db.events.select.byGroupId as jest.Mock).mockResolvedValue([recent, future, now, older]);

    await expect(service.timeline.getPastEventsForGroup("group-1")).resolves.toEqual({
      history: [older, recent],
      pastEventsRecords: { "past-1": 0, "past-2": 2 },
    });
    expect(db.events.select.byGroupId).toHaveBeenCalledWith("group-1");
  });

  it.each([
    { events: [] },
    { events: [makeGroupEventSummary({ starts_at_ms: Date.parse("2026-04-08T00:00:00.000Z") })] },
  ])(
    "returns empty history when there are no past events (%#)",
    async ({ events }) => {
      (db.events.select.byGroupId as jest.Mock).mockResolvedValue(events);
      await expect(service.timeline.getPastEventsForGroup("group-1")).resolves.toEqual({
        history: [], pastEventsRecords: {},
      });
    },
  );
});

describe("EventService.lifecycle.updateEventStatus", () => {
  let service: EventService;
  let db: ReturnType<typeof createMockDb>;
  let updateEventStatusInDb: jest.Mock;

  const eventUpdate = {
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
      service.lifecycle.updateEventStatus(USER_ID, eventUpdate),
    ).rejects.toThrow("403");

    expect(policyMock.requireOrganizer).toHaveBeenCalled();
    expect(updateEventStatusInDb).not.toHaveBeenCalled();
  });

  it("updates the event status", async () => {
    authenticateAs();
    (policyMock.requireOrganizer as jest.Mock).mockImplementation(() => {});
    updateEventStatusInDb.mockResolvedValue({ updateStatus: "success" });

    await expect(
      service.lifecycle.updateEventStatus(USER_ID, eventUpdate),
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
      service.lifecycle.createEvent(createEventInput, undefined),
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
      service.lifecycle.createEvent(createEventInput, USER_ID),
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
      service.lifecycle.createEvent(createEventInput, USER_ID),
    ).resolves.toEqual({ ok: true, data: createdEvent });

    expect(policyMock.requireOrganizer).toHaveBeenCalledWith("user-1", groupId);
    expect(createNewEventInDb).toHaveBeenCalledWith(createEventInput);
  });
});
