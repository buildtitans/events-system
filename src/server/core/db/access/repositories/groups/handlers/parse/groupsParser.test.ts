import { GroupsParser } from "./groupsParser";
import type { ReadTimelineItem, ReadHydratedGroupResult } from "../../types";
import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import { TimelineSchema } from "@/src/schemas/groups/timelineSchema";
import { GroupHydrationReadSchema } from "@/src/schemas/groups/groupSchema";

const startsAt = new Date("2030-01-01T18:00:00.000Z");

function makeTimelineItem(
  overrides: Partial<ReadTimelineItem> = {},
): ReadTimelineItem {
  return {
    id: "event-1",
    group_id: "group-1",
    starts_at: startsAt,
    created_at: new Date("2029-12-01T12:00:00.000Z"),
    image: "event.png",
    timeline_status: "today",
    number_attended: 0,
    ...overrides,
  };
}

function makeHydratedGroup(
  overrides: Partial<ReadHydratedGroupResult> = {},
): ReadHydratedGroupResult {
  return {
    id: "group-1",
    name: "React Community",
    slug: "react-community",
    description: null,
    location: null,
    category_id: "00000000-0000-4000-8000-000000000001",
    category_name: "Technology",
    organizer_id: "00000000-0000-4000-8000-000000000002",
    organizer_email: "organizer@example.com",
    member_count: 1,
    created_at: new Date("2029-12-01T12:00:00.000Z"),
    updated_at: new Date("2029-12-02T12:00:00.000Z"),
    next_event: null,
    group_events: [],
    calandar: [],
    viewer_role: "anonymous",
    ...overrides,
  };
}

describe("GroupsParser", () => {
  const parser = new GroupsParser();

  afterEach(() => jest.useRealTimers());

  it("normalizes calendar JSON timestamps and counts through the existing timeline parser", () => {
    jest.useFakeTimers().setSystemTime(startsAt);
    const item = makeTimelineItem();
    const result = parser.toHydratedGroup(
      makeHydratedGroup({
        viewer_role: "member",
        calandar: [
          {
            ...item,
            starts_at: item.starts_at.toISOString(),
            created_at: item.created_at.toISOString(),
            number_attended: "4",
            timeline_status: "past",
          },
          {
            ...item,
            starts_at: item.starts_at.toISOString(),
            created_at: item.created_at.toISOString(),
            number_attended: "0",
          },
        ],
        group_events: [
          {
            id: "event-1",
            group_id: "group-1",
            status: "scheduled",
            starts_at: startsAt.toISOString(),
            img: "event.png",
            tag: null,
            title: "Meetup",
            meeting_location: "Library",
            going_count: "0",
            interested_count: "2",
          },
        ],
      }),
    );
    expect(validateOrThrow(GroupHydrationReadSchema, result)).toEqual(result);
    expect(result.meta.viewer_role).toBe("member");
    expect(result.meta.calandar[0]).toMatchObject({
      timeline_status: "past",
      meta: { number_attendend: 4 },
    });
    expect(result.meta.calandar[1]).toMatchObject({
      timeline_status: "today",
      event_phase: "ongoing",
      event: { starts_at_ms: startsAt.getTime() },
    });
    expect(result.meta.group_events[0]).toMatchObject({
      event: { starts_at_ms: startsAt.getTime() },
      meta: {
        category_name: "Technology",
        attendance: { going: 0, interested: 2 },
      },
    });
    expect(result.group).not.toHaveProperty("calandar");
  });

  it.each([
    [-1, "upcoming"],
    [0, "ongoing"],
    [2 * 60 * 60 * 1000 - 1, "ongoing"],
    [2 * 60 * 60 * 1000, "completed"],
  ])("classifies today's event at offset %i ms as %s", (offset, phase) => {
    jest.useFakeTimers().setSystemTime(startsAt.getTime() + offset);
    const result = parser.toTimeline([makeTimelineItem()]);
    expect(validateOrThrow(TimelineSchema, result)).toEqual(result);
    expect(result[0]).toMatchObject({
      timeline_status: "today",
      event_phase: phase,
      event: {
        starts_at: startsAt.toISOString(),
        starts_at_ms: startsAt.getTime(),
      },
    });
  });

  it("preserves past attendance and omits daily phases outside today", () => {
    const result = parser.toTimeline([
      makeTimelineItem({ timeline_status: "past", number_attended: 4 }),
      makeTimelineItem({ timeline_status: "upcoming" }),
    ]);
    expect(validateOrThrow(TimelineSchema, result)).toEqual(result);
    expect(result[0]).toMatchObject({ meta: { number_attendend: 4 } });
    for (const item of result) expect(item).not.toHaveProperty("event_phase");
  });

  it("serializes a hydrated group without fabricating a next event", () => {
    const result = parser.toHydratedGroup(makeHydratedGroup());
    expect(validateOrThrow(GroupHydrationReadSchema, result)).toEqual(result);
    expect(result.group.created_at).toBe("2029-12-01T12:00:00.000Z");
    expect(result.meta).not.toHaveProperty("next_event");
  });

  it("normalizes JSON event dates and attendance in hydrated groups", () => {
    const result = parser.toHydratedGroup(
      makeHydratedGroup({
        next_event: {
          id: "event-1",
          group_id: "group-1",
          title: "React Night",
          description: "Meetup",
          status: "scheduled",
          tag: null,
          img: "event.png",
          meeting_location: "Library",
          starts_at: "2030-01-01T18:00:00+00:00",
          going_count: "0",
          interested_count: "2",
        },
      }),
    );
    expect(validateOrThrow(GroupHydrationReadSchema, result)).toEqual(result);
    expect(result.meta).toMatchObject({
      next_event: {
        event: {
          starts_at: startsAt.toISOString(),
          starts_at_ms: startsAt.getTime(),
        },
        meta: { attendance: { going: 0, interested: 2 } },
      },
    });
  });
});
