import type { GroupHydratedSchemaType, NextEventForGroupSummarySchemaType } from "@/src/schemas/groups/groupSchema";
import type { OpenedGroupPayload } from "../types";

export function makeNextEvent(): NextEventForGroupSummarySchemaType {
  return {
    event: {
      id: "event-1",
      group_id: "group-1",
      status: "scheduled",
      starts_at: "2026-08-19T18:00:00.000Z",
      starts_at_ms: Date.parse("2026-08-19T18:00:00.000Z"),
      img: "event.jpg",
      tag: "Type Safety",
      title: "Runtime Validation Meets Static Types",
      description: "An event about runtime validation.",
      meeting_location: "Online",
    },
    meta: {
      attendance: { going: 2, interested: 1 },
      category_name: "Technology",
    },
  };
}

export function makeHydratedGroup(
  meta: Partial<GroupHydratedSchemaType["meta"]> = {},
): GroupHydratedSchemaType {
  return {
    group: {
      id: "group-1",
      name: "Illinois TypeScript Enthusiasts",
      slug: "illinois-typescript-enthusiasts",
      description: "A TypeScript community.",
      location: "Online",
      category_id: "00000000-0000-4000-8000-000000000001",
      organizer_id: "00000000-0000-4000-8000-000000000002",
      created_at: "2026-08-01T12:00:00.000Z",
      updated_at: "2026-08-01T12:00:00.000Z",
    },
    meta: {
      member_count: 2,
      organizer_email: "organizer@example.com",
      category_name: "Technology",
      ...meta,
    },
  };
}

export function makeHydrationPayload(
  overrides: Partial<OpenedGroupPayload> = {},
): OpenedGroupPayload {
  return {
    hydrated: makeHydratedGroup(),
    layout: [],
    role: "member",
    calandar: [],
    ...overrides,
  };
}
