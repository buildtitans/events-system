import type { GroupHydratedSchemaType, NextEventForGroupSummarySchemaType } from "@/src/schemas/groups/groupSchema";
import type { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";

export function makeNextEvent(): NextEventForGroupSummarySchemaType {
  return {
    event: { id: "event-1", group_id: "group-1", status: "scheduled", starts_at: "2030-01-01T18:00:00.000Z", starts_at_ms: Date.parse("2030-01-01T18:00:00.000Z"), img: "event.png", description: "Meetup", tag: null, title: "Community Night", meeting_location: "Library" },
    meta: { attendance: { going: 0, interested: 2 }, category_name: "Technology" },
  };
}

export function makeTimelineItem(overrides: Partial<TimelineElementSchemaType> = {}): TimelineElementSchemaType {
  const event = { id: "event-1", starts_at: "2030-01-01T18:00:00.000Z", starts_at_ms: Date.parse("2030-01-01T18:00:00.000Z"), created_at: "2029-12-01T12:00:00.000Z", image: "event.png" };
  switch (overrides.timeline_status) {
    case "past": return { event: overrides.event ?? event, timeline_status: "past", meta: overrides.meta ?? { number_attendend: 4 } };
    case "today": return { event: overrides.event ?? event, timeline_status: "today", event_phase: overrides.event_phase ?? "ongoing" };
    default: return { event: overrides.event ?? event, timeline_status: "upcoming" };
  }
}

export function makeHydratedGroup(events: Partial<GroupHydratedSchemaType["meta"]["events"]> = {}, metadata: Partial<Omit<GroupHydratedSchemaType["meta"], "events">> = {}): GroupHydratedSchemaType {
  return {
    group: { id: "group-1", name: "Community", slug: "community", description: null, location: null, category_id: "00000000-0000-4000-8000-000000000001", organizer_id: "00000000-0000-4000-8000-000000000002", created_at: "2029-12-01T12:00:00.000Z", updated_at: "2029-12-01T12:00:00.000Z" },
    meta: { category_name: "Technology", organizer_email: "organizer@example.com", member_count: 1, viewer_role: "anonymous", ...metadata, events: { group_events: [], calandar: [], ...events } },
  };
}
