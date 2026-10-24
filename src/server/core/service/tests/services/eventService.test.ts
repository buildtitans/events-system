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
  it.each(["popular", "upcoming"] as const)("composes %s summaries directly without broad reads or an ID refetch", async filter => {
    const db = createMockDb();
    const summaries = [makeEventSummary({ id: "first" }), makeEventSummary({ id: "second" })];
    jest.mocked(db.events.select[filter]).mockResolvedValue(summaries);
    const service = new EventService(db, policyMock);
    const pages = await service.layout[filter]();
    expect(pages[0].map(slot => slot.kind === "card" ? slot.event.content : undefined)).toEqual(summaries);
    expect(db.events.select[filter]).toHaveBeenCalledTimes(1);
    expect(db.events.select.allScheduled).not.toHaveBeenCalled();
    expect(db.events.select.byIds).not.toHaveBeenCalled();
    expect(db.eventAttendants.select.allRecords).not.toHaveBeenCalled();
  });

  it.each(["popular", "upcoming"] as const)("returns an empty layout for empty %s results", async filter => {
    const db = createMockDb();
    jest.mocked(db.events.select[filter]).mockResolvedValue([]);
    const service = new EventService(db, policyMock);
    await expect(service.layout[filter]()).resolves.toEqual([]);
  });
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
