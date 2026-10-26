import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { EventStatusSchema } from "@/src/schemas/events/eventSchema";
import {
  EventAttendantsSchema,
  EventAttendantStatusSchema,
  EventHeadCountSchema,
} from "./eventAttendantsSchema";
import { GroupSchema } from "../groups/groupSchema";
import { CategorySchema } from "../groups/categoriesSchema";

export const RsvpSchema = Type.Object({
  attendance_status: EventAttendantStatusSchema,
  group_id: Type.String({ format: "uuid" }),
  event_id: Type.String({ format: "uuid" }),
  event_title: Type.String(),
  location: Type.String(),
  starts_at: Type.String({ format: "date-time" }),
  starts_at_ms: Type.Integer({ minimum: 0 }),
  scheduled_status: EventStatusSchema,
});

export const RsvpSurfaceSchema = Type.Object({
  rsvp: RsvpSchema,
  meta: Type.Object({
    group_name: GroupSchema.properties.name,
    group_slug: GroupSchema.properties.slug,
    category_name: CategorySchema.properties.name,
  }),
});

export type RsvpSurfaceSchemaType = Static<typeof RsvpSurfaceSchema>;

export const RsvpSurfacesSchema = Type.Array(RsvpSurfaceSchema);

export const RsvpSchemaArray = Type.Array(RsvpSchema);

export type RsvpSchemaType = Static<typeof RsvpSchema>;

export const CompiledRsvpSchema = TypeCompiler.Compile(RsvpSchema);

export const RsvpUpdateResponseSchema = Type.Object({
  updated: EventAttendantsSchema,
  headCount: EventHeadCountSchema,
});

export type RsvpUpdateResponseSchemaType = Static<
  typeof RsvpUpdateResponseSchema
>;
