import { Static, Type } from "@sinclair/typebox";
import { EventSchema } from "../events/eventSchema";

const TimelineEventSchema = Type.Object({
  id: EventSchema.properties.id,
  starts_at: EventSchema.properties.starts_at,
  starts_at_ms: EventSchema.properties.starts_at_ms,
  created_at: EventSchema.properties.created_at,
  image: EventSchema.properties.img,
});

const PastTimelineItemSchema = Type.Object({
  timeline_status: Type.Literal("past"),
  event: TimelineEventSchema,
  meta: Type.Object({
    number_attendend: Type.Number(),
  }),
});

const FutureTimelineSchema = Type.Object({
  timeline_status: Type.Literal("upcoming"),
  event: TimelineEventSchema,
});

const EventPhaseSchema = Type.Union([
  Type.Literal("upcoming"),
  Type.Literal("ongoing"),
  Type.Literal("completed"),
]);

export type EventPhaseSchemaType = Static<typeof EventPhaseSchema>;

const CurrentDateTimelineItem = Type.Object({
  timeline_status: Type.Literal("today"),
  event: TimelineEventSchema,
  event_phase: EventPhaseSchema,
});

export const TimelineElementSchema = Type.Union([
  CurrentDateTimelineItem,
  FutureTimelineSchema,
  PastTimelineItemSchema,
]);

export const TimelineSchema = Type.Array(TimelineElementSchema);

export type TimelineElementSchemaType = Static<typeof TimelineElementSchema>;
