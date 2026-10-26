jest.mock("kysely", () => ({
  sql: Object.assign(jest.fn(), { ref: jest.fn() }),
}));
jest.mock("kysely/helpers/postgres", () => ({ jsonObjectFrom: jest.fn() }));
jest.mock("@/src/server/core/lib/utils/queries/textSearchRelevance", () => ({
  textSearchRelevance: jest.fn(),
}));
import type { Kysely } from "kysely";
import type { DB } from "../../types/db";
import { EventsReader } from "@/src/server/core/db/access/repositories/events/handlers/read/eventsReader";
import { EventsParser } from "@/src/server/core/db/access/repositories/events/handlers/parse/eventsParser";
import { GroupsReader as RawGroupsReader } from "./groups/handlers/read/groupsReader";
import { GroupsParser } from "./groups/handlers/parse/groupsParser";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { GroupDiscoverySchema } from "@/src/schemas/groups/groupSchema";
import {
  EventSearchResultSchema,
  EventSearchSuggestionSchema,
  GroupSearchResultSchema,
  GroupSearchSuggestionSchema,
} from "@/src/schemas/search/searchSchema";

function setup(rows: Record<string, unknown>[]) {
  const query = {
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(rows),
  };
  const db = {
    selectFrom: jest.fn().mockReturnValue(query),
  } as unknown as Kysely<DB>;
  return {
    events: new EventsReader(db, new EventsParser()),
    groups: new RawGroupsReader(db, new GroupsParser()),
    query,
  };
}

const eventRow = () => ({
  id: "event-1",
  title: "React Night",
  group_id: "group-1",
  description: "Meetup",
  tag: null,
  img: "event.png",
  starts_at: new Date("2030-01-01T18:00:00.000Z"),
  group_name: "React Community",
  group_location: null,
  group_slug: "react-community",
  going: "0",
  interested: "2",
  timeline_status: "today",
  event_phase: "ongoing",
});

describe("search readers", () => {
  it("preserves zero-attendance events and maps counts and today's phase", async () => {
    const { events, query } = setup([eventRow()]);
    const [result] = await events.query.search("react");
    expect(validateOrThrow(EventSearchResultSchema, result)).toEqual(result);
    expect(result).toMatchObject({
      kind: "event",
      timeline_status: "today",
      event_phase: "ongoing",
      data: {
        meta: {
          attendance: { going: 0, interested: 2 },
          group: { group_location: null },
        },
      },
    });
    expect(query.leftJoin).toHaveBeenCalledWith(
      "event_attendants as ea",
      "e.id",
      "ea.event_id",
    );
    expect(query.groupBy).toHaveBeenCalledWith(["e.id", "g.id"]);
    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.limit).toHaveBeenCalledWith(25);
  });

  it.each(["past", "upcoming"])(
    "omits the daily phase for %s results",
    async (timeline_status) => {
      const { events } = setup([{ ...eventRow(), timeline_status }]);
      const [result] = await events.query.search("react");
      expect(validateOrThrow(EventSearchResultSchema, result)).toEqual(result);
      expect(result).not.toHaveProperty("event_phase");
    },
  );

  it("returns event suggestions with their host details without client lookups", async () => {
    const {
      id,
      title,
      group_id,
      starts_at,
      group_name,
      group_location,
      group_slug,
    } = eventRow();
    const { events, query } = setup([
      {
        id,
        title,
        group_id,
        starts_at,
        group_name,
        group_location,
        group_slug,
      },
    ]);
    const [result] = await events.query.suggest("react");
    expect(validateOrThrow(EventSearchSuggestionSchema, result)).toEqual(
      result,
    );
    expect(result.data.event.starts_at_ms).toBe(starts_at.getTime());
    expect(result.data.meta.group.group_slug).toBe("react-community");
    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.limit).toHaveBeenCalledWith(5);
  });

  const groupRow = () => ({
    id: "group-1",
    name: "React",
    slug: "react",
    description: null,
    location: null,
    category_name: "Technology",
    member_count: "0",
    next_event_scheduled: null,
  });

  it("allows groups with no members or scheduled events", async () => {
    const { groups, query } = setup([groupRow()]);
    const [result] = await groups.query.search("react");
    expect(validateOrThrow(GroupSearchResultSchema, result)).toEqual(result);
    expect(result.data.meta.member_count).toBe(0);
    expect(result.data.meta).not.toHaveProperty("next_event_scheduled");
    expect(query.limit).toHaveBeenCalledWith(25);
  });

  it("serializes the next scheduled event and nests suggestion metadata", async () => {
    const { groups } = setup([
      { ...groupRow(), next_event_scheduled: new Date("2030-01-01T18:00:00Z") },
    ]);
    const [result] = await groups.query.search("react");
    expect(result.data.meta.next_event_scheduled).toBe(
      "2030-01-01T18:00:00.000Z",
    );
    const [suggestion] = await groups.query.suggest("react");
    expect(validateOrThrow(GroupSearchSuggestionSchema, suggestion)).toEqual(
      suggestion,
    );
    expect(suggestion.data.meta.group).toEqual({
      category_name: "Technology",
      member_count: 0,
    });
  });

  it("keeps discovery groups without a next event and validates the strict absent branch", async () => {
    const {
      id,
      name,
      slug,
      description,
      location,
      category_name,
      member_count,
    } = groupRow();
    const row = {
      id,
      name,
      slug,
      description,
      location,
      category_name,
      member_count,
    };
    const { groups, query } = setup([{ ...row, next_event: null }]);
    const result = await groups.hydrate.list.all();
    expect(validateOrThrow(GroupDiscoverySchema, result)).toEqual(result);
    expect(result[0].meta).toEqual({
      kind: "no_next_event",
      category_name: "Technology",
      member_count: 0,
    });
    expect(result[0].meta).not.toHaveProperty("next_event");
    expect(query.orderBy).toHaveBeenCalledWith("g.created_at", "desc");
    expect(() =>
      validateOrThrow(GroupDiscoverySchema, [
        {
          ...result[0],
          meta: { ...result[0].meta, next_event: null },
        },
      ]),
    ).toThrow("Invalid Schema");
  });

  it("maps JSON dates and counts for the complete next-event preview", async () => {
    const {
      id,
      name,
      slug,
      description,
      location,
      category_name,
      member_count,
    } = groupRow();
    const row = {
      id,
      name,
      slug,
      description,
      location,
      category_name,
      member_count,
    };
    const starts_at = "2030-01-01T18:00:00+00:00";
    const { groups } = setup([
      {
        ...row,
        member_count: "3",
        next_event: {
          id: "event-1",
          title: "React Night",
          description: "Meetup",
          starts_at,
          going: "0",
          interested: "2",
        },
      },
    ]);
    const result = await groups.hydrate.list.all();
    expect(validateOrThrow(GroupDiscoverySchema, result)).toEqual(result);
    const { meta } = result[0];
    expect(meta.kind).toBe("has_next_event");
    if (meta.kind !== "has_next_event") throw new Error("Missing next event");
    expect(meta.member_count).toBe(3);
    expect(meta.next_event.event.starts_at).toBe("2030-01-01T18:00:00.000Z");
    expect(meta.next_event.event.starts_at_ms).toBe(
      new Date(starts_at).getTime(),
    );
    expect(meta.next_event.meta.attendance).toEqual({
      going: 0,
      interested: 2,
    });
  });

  it("keeps category and organizer restrictions on the shared discovery query", async () => {
    const { groups, query } = setup([]);
    await expect(
      groups.hydrate.list.byCategoryId("category-1"),
    ).resolves.toEqual([]);
    expect(query.where).toHaveBeenCalledWith(
      "g.category_id",
      "=",
      "category-1",
    );
    await expect(
      groups.hydrate.list.byOrganizerId("organizer-1"),
    ).resolves.toEqual([]);
    expect(query.where).toHaveBeenCalledWith(
      "g.organizer_id",
      "=",
      "organizer-1",
    );
  });
});

describe("event list query constraints", () => {
  afterEach(() => jest.useRealTimers());

  it("restricts discovery to future scheduled events with stable chronological ordering", async () => {
    const now = new Date("2030-01-01T18:00:00Z");
    jest.useFakeTimers().setSystemTime(now);
    const { events, query } = setup([]);

    await expect(events.hydrate.list.discovery()).resolves.toEqual([]);

    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.where).toHaveBeenCalledWith("e.starts_at", ">", now);
    expect(query.orderBy.mock.calls).toEqual([
      ["e.starts_at", "asc"],
      ["e.id", "asc"],
    ]);
  });

  it("filters group layouts in SQL and orders their events chronologically", async () => {
    const now = new Date("2030-01-01T18:00:00Z");
    jest.useFakeTimers().setSystemTime(now);
    const { events, query } = setup([]);
    await events.hydrate.list.forGroup("group-1");
    expect(query.where).toHaveBeenCalledWith("e.starts_at", ">=", now);
    expect(query.where).toHaveBeenCalledWith("e.group_id", "=", "group-1");
    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.orderBy).toHaveBeenCalledWith("e.starts_at", "asc");
  });

  it("selects the inclusive 30-day window with stable chronological ordering", async () => {
    const now = new Date("2030-01-01T18:00:00Z");
    jest.useFakeTimers().setSystemTime(now);
    const { events, query } = setup([]);
    await events.hydrate.list.upcoming();
    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.where).toHaveBeenCalledWith("e.starts_at", ">=", now);
    expect(query.where).toHaveBeenCalledWith(
      "e.starts_at",
      "<=",
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    );
    expect(query.orderBy.mock.calls).toEqual([
      ["e.starts_at", "asc"],
      ["e.id", "asc"],
    ]);
    expect(query.having).not.toHaveBeenCalled();
  });

  it("counts going and interested together with a threshold of three for future events", async () => {
    const now = new Date("2030-01-01T18:00:00Z");
    jest.useFakeTimers().setSystemTime(now);
    const { events, query } = setup([]);
    await events.hydrate.list.popular();
    expect(query.where).toHaveBeenCalledWith("e.starts_at", ">", now);
    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.having).toHaveBeenCalledWith(expect.any(Function), ">=", 3);
    const filterWhere = jest.fn().mockReturnValue({});
    query.having.mock.calls[0][0]({
      fn: { countAll: () => ({ filterWhere }) },
    });
    expect(filterWhere).toHaveBeenCalledWith("ea.status", "in", [
      "going",
      "interested",
    ]);
    expect(query.orderBy.mock.calls).toEqual([
      ["e.starts_at", "asc"],
      ["e.id", "asc"],
    ]);
  });

  it("restricts group history to past scheduled events and orders newest first", async () => {
    const now = new Date("2030-01-01T18:00:00Z");
    jest.useFakeTimers().setSystemTime(now);
    const { groups, query } = setup([]);
    await groups.query.history("group-1");
    expect(query.where).toHaveBeenCalledWith("e.starts_at", "<", now);
    expect(query.where).toHaveBeenCalledWith("e.group_id", "=", "group-1");
    expect(query.where).toHaveBeenCalledWith("e.status", "=", "scheduled");
    expect(query.orderBy.mock.calls).toEqual([
      ["e.starts_at", "desc"],
      ["e.id", "desc"],
    ]);
  });
});
