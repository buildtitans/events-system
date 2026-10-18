import { Type, Static } from "@sinclair/typebox";
import { GroupRoleSchema } from "./groupMembersSchema";
import { CategorySchema } from "./categoriesSchema";
import { GroupSchema } from "./groupSchema";

export const UserMembershipSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
  group_name: Type.String(),
  group_description: GroupSchema.properties.description,
  location: Type.String(),
  group_slug: Type.String(),
  roleInGroup: GroupRoleSchema,
});

const NoGroupEventsScheduled = Type.Object({
  timeline_status: Type.Literal("no_events"),
});

const UpcomingGroupEvent = Type.Object({
  timeline_status: Type.Literal("upcoming"),
  next_event_scheduled: Type.String({ format: "date-time" }),
});

const OnlyPastGroupEvents = Type.Object({
  timeline_status: Type.Literal("past_only"),
  last_event_held: Type.String({ format: "date-time" }),
});

const OnlyTodaysEvent = Type.Object({
  timeline_status: Type.Literal("today_only"),
  todays_event: Type.String({ format: "date-time" }),
});

export const GroupScheduleSchema = Type.Union([
  NoGroupEventsScheduled,
  OnlyPastGroupEvents,
  OnlyTodaysEvent,
  UpcomingGroupEvent,
]);

export type GroupScheduleSchemaType = Static<typeof GroupScheduleSchema>;

const UserMembershipMetadataSchema = Type.Object({
  schedule: GroupScheduleSchema,
  category_name: Type.Optional(CategorySchema.properties.name),
  member_headcount: Type.Number(),
});

export const UserMembershipSurfaceSchema = Type.Object({
  membership: UserMembershipSchema,
  meta: UserMembershipMetadataSchema,
});

export type UserMembershipSurfaceSchemaType = Static<
  typeof UserMembershipSurfaceSchema
>;

export const UserMembershipsSchema = Type.Array(UserMembershipSurfaceSchema);

export const UserMembershipSchemaArray = Type.Array(UserMembershipSchema);

export type UserMembershipSchemaArrayType = Static<
  typeof UserMembershipSchemaArray
>;

export type UserMembershipSchemaType = Static<typeof UserMembershipSchema>;
