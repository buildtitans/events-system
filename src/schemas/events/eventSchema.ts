import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import {
  EventAttendantStatusSchema,
  EventHeadCountSchema,
} from "./eventAttendantsSchema";
import { GroupRoleSchema } from "../groups/groupMembersSchema";

const EVENT_TAG_MAX_LENGTH = 24;

const EventTagSchema = Type.Union([
  Type.String({
    maxLength: EVENT_TAG_MAX_LENGTH,
    pattern: "^\\s*\\S+(?:\\s+\\S+)?\\s*$",
  }),
  Type.Null(),
]);

export const EventStatusSchema = Type.Union([
  Type.Literal("scheduled"),
  Type.Literal("cancelled"),
]);

const EventSchema = Type.Object({
  id: Type.String(),
  group_id: Type.String(),
  status: EventStatusSchema,
  starts_at: Type.String({ format: "date-time" }),
  starts_at_ms: Type.Integer({ minimum: 0 }),
  img: Type.String(),
  tag: EventTagSchema,
  title: Type.String(),
  description: Type.String(),
  meeting_location: Type.String(),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
});

const EventForDiscovery = Type.Pick(EventSchema, [
  "id",
  "group_id",
  "status",
  "starts_at",
  "starts_at_ms",
  "img",
  "tag",
  "title",
]);

const EventDiscoverySummaryMeta = Type.Object({
  group_name: Type.String(),
  group_location: Type.String(),
  attendance: EventHeadCountSchema,
  category_name: Type.String({ minLength: 1 }),
});

const GroupEventSummaryMetaDataSchema = Type.Pick(EventDiscoverySummaryMeta, [
  "attendance",
  "category_name",
]);

const GroupEventSummary = Type.Pick(EventSchema, [
  "id",
  "group_id",
  "status",
  "starts_at",
  "starts_at_ms",
  "img",
  "tag",
  "title",
  "meeting_location",
]);

export const EventDiscoverySummarySchema = Type.Object({
  meta: EventDiscoverySummaryMeta,
  event: EventForDiscovery,
});

export const EventsForDiscoverySchema = Type.Array(EventDiscoverySummarySchema);

export type EventDiscoverySummarySchemaType = Static<
  typeof EventDiscoverySummarySchema
>;

const EventMetaDataSchema = Type.Object({
  group_name: Type.String(),
  group_slug: Type.String(),
  attendants: EventHeadCountSchema,
});

export const GroupEventSummarySchema = Type.Object({
  event: GroupEventSummary,
  meta: GroupEventSummaryMetaDataSchema,
});

export const EventsForGoupSchema = Type.Array(GroupEventSummarySchema);

export type GroupEventSummarySchemaType = Static<
  typeof GroupEventSummarySchema
>;

const EventDiscoverySurfaceSchema = Type.Object({
  for: Type.Literal("discovery"),
  content: EventDiscoverySummarySchema,
});

const GroupEventSummarySurfaceSchema = Type.Object({
  for: Type.Literal("withinGroup"),
  content: GroupEventSummarySchema,
});

export type EventDiscoverySurfaceSchemaType = Static<
  typeof EventDiscoverySurfaceSchema
>;

export type GroupEventSummarySurfaceSchemaType = Static<
  typeof GroupEventSummarySurfaceSchema
>;

export const EventSurfaceSchema = Type.Union([
  EventDiscoverySurfaceSchema,
  GroupEventSummarySurfaceSchema,
]);

export type EventSurfaceSchemaType = Static<typeof EventSurfaceSchema>;

export const UserSpecificEventMetaDataSchema = Type.Object({
  status: EventAttendantStatusSchema,
  role: GroupRoleSchema,
});

export type UserSpecificEventMetaDataSchemaType = Static<
  typeof UserSpecificEventMetaDataSchema
>;

const HydratedEventMetaDataSchema = Type.Object({
  event: EventMetaDataSchema,
  user: UserSpecificEventMetaDataSchema,
});

export const EventReadModelSchema = Type.Object({
  event: EventSchema,
  meta: EventMetaDataSchema,
});

export type EventReadModelSchemaType = Static<typeof EventReadModelSchema>;

export const HydratedEventSchema = Type.Object({
  event: EventSchema,
  meta: HydratedEventMetaDataSchema,
});

export type HydratedEventSchemaType = Static<typeof HydratedEventSchema>;

const GroupIdSchema = Type.String();

export const GroupIdArraySchema = Type.Array(GroupIdSchema);

export type GroupIdArraySchema = Static<typeof GroupIdArraySchema>;

const NonEmptyString = Type.String({ minLength: 1 });

const NewEventInputSchema = Type.Object({
  group_id: NonEmptyString,
  starts_at: Type.String({ minLength: 1 }),
  title: NonEmptyString,
  description: Type.String(),
  meeting_location: Type.String(),
  img: Type.Union([NonEmptyString, Type.Null()]),
  tag: EventTagSchema,
});

const EventsArraySchema = Type.Array(EventSchema);

const EventsReponseSchema = Type.Object({
  items: EventsArraySchema,
  meta: Type.Object({
    total: Type.Number(),
  }),
});

const UpdateEventArgsSchema = Type.Object({
  event_id: Type.String({ format: "uuid" }),
  status: EventStatusSchema,
  group_id: Type.String({ format: "uuid" }),
});

type UpdateEventArgsSchemaType = Static<typeof UpdateEventArgsSchema>;

type GroupIdSchemaType = Static<typeof GroupIdSchema>;

type NewEventInputSchemaType = Static<typeof NewEventInputSchema>;

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;

type EventsReponseSchemaType = Static<typeof EventsReponseSchema>;

export {
  EventSchema,
  EventsArraySchema,
  EventsReponseSchema,
  NewEventInputSchema,
  GroupIdSchema,
  UpdateEventArgsSchema,
};

export type {
  EventSchemaType,
  EventsArraySchemaType,
  EventsReponseSchemaType,
  NewEventInputSchemaType,
  GroupIdSchemaType,
  UpdateEventArgsSchemaType,
};

export const NewEventInputSchemaValidator =
  TypeCompiler.Compile(NewEventInputSchema);

export const GroupIdSchemaValidator = TypeCompiler.Compile(GroupIdSchema);

export const UpdateEventArgsSchemaValidator = TypeCompiler.Compile(
  UpdateEventArgsSchema,
);
