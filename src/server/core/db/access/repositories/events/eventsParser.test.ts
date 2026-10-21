import { EventsParser } from "./eventsParser";
import type {
  EventForDiscovery,
  RawReadHydratedEvent,
  ReadGroupEvent,
  ReadNextEvent,
} from "./types";

const startsAt = new Date("2030-01-01T18:00:00.000Z");

function makeEvent() {
  return {
    id: "event-1", group_id: "group-1", title: "React Night",
    description: "Meetup", status: "scheduled", img: "event.png", tag: null,
    meeting_location: "Library", starts_at: startsAt,
  };
}

function makeDiscoveryRow(overrides: Partial<EventForDiscovery> = {}): EventForDiscovery {
  return {
    ...makeEvent(), group_name: "React Community", group_location: null,
    category_name: "Technology", going_count: 0, interested_count: 2,
    ...overrides,
  };
}

describe("EventsParser", () => {
  const parser = new EventsParser();

  it("serializes hydrated dates and converts database counts", () => {
    const row: RawReadHydratedEvent = {
      ...makeEvent(), created_at: new Date("2029-12-01T12:00:00Z"),
      updated_at: new Date("2029-12-02T12:00:00Z"),
      group_name: "React Community", group_slug: "react-community",
      going: "0", interested: BigInt(2),
    };
    const result = parser.toHydratedEvent(row);
    expect(result.event).toMatchObject({
      starts_at: startsAt.toISOString(), starts_at_ms: startsAt.getTime(),
      created_at: "2029-12-01T12:00:00.000Z", updated_at: "2029-12-02T12:00:00.000Z",
    });
    expect(result.meta).toEqual({
      group_name: "React Community", group_slug: "react-community",
      attendants: { going: 0, interested: 2 },
    });
    expect(result.event).not.toHaveProperty("going");
  });

  it("preserves the discovery location fallback and absent category", () => {
    const [result] = parser.toDiscoverableEvents([makeDiscoveryRow({ category_name: null })]);
    expect(result.event.starts_at_ms).toBe(startsAt.getTime());
    expect(result.meta).toEqual({
      group_name: "React Community", group_location: "Online", category_name: undefined,
      attendance: { going: 0, interested: 2 },
    });
    expect(result.event).not.toHaveProperty("going_count");
  });

  it("retains supplied locations and IDs for events selected by ID", () => {
    const row = {
      ...makeEvent(), group_name: "React Community", group_location: "Chicago",
      category_name: "Technology", going_count: 3, interested_count: 0,
    };
    const [result] = parser.toEventsByIds([row]);
    expect(result.event).toMatchObject({
      id: row.id, group_id: row.group_id, starts_at: startsAt.toISOString(),
    });
    expect(result.meta).toMatchObject({
      group_location: "Chicago", attendance: { going: 3, interested: 0 },
    });
    expect(parser.toEventsByIds([{ ...row, group_location: null }])[0].meta.group_location)
      .toBe("Online");
  });

  it("returns undefined when a group has no next event", () => {
    expect(parser.toNextEvent(undefined)).toBeUndefined();
  });

  it("maps a next event with its category and zero attendance", () => {
    const row: ReadNextEvent = {
      ...makeEvent(), category_name: "Technology", going: 0, interested: 0,
    };
    expect(parser.toNextEvent(row)).toEqual({
      event: { ...makeEvent(), starts_at: startsAt.toISOString(), starts_at_ms: startsAt.getTime() },
      meta: { category_name: "Technology", attendance: { going: 0, interested: 0 } },
    });
  });

  it("preserves group event details while separating attendance metadata", () => {
    const row: ReadGroupEvent = {
      ...makeEvent(), category_name: null, going_count: 2, interested_count: 1,
    };
    const [result] = parser.toGroupEvents([row]);
    expect(result.event).toMatchObject({
      meeting_location: "Library", title: "React Night", starts_at: startsAt.toISOString(),
    });
    expect(result.meta).toEqual({
      category_name: undefined, attendance: { going: 2, interested: 1 },
    });
    expect(result.event).not.toHaveProperty("interested_count");
  });
});
