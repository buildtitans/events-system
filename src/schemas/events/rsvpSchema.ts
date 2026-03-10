import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { EventStatusSchema } from "./eventSchema";
import { createValidator } from "@/src/lib/utils/validation/validateSchema";

export const RsvpSchema = Type.Object({
  group_name: Type.String(),
  group_id: Type.String({ format: "uuid" }),
  event_id: Type.String({ format: "uuid" }),
  event_title: Type.String(),
  location: Type.String(),
  starts_at: Type.String({ format: "date-time" }),
  starts_at_ms: Type.Integer({ minimum: 0 }),
  scheduled_status: EventStatusSchema,
});

const RsvpSchemaArray = Type.Array(RsvpSchema);

export type RsvpSchemaType = Static<typeof RsvpSchema>;

export const CompiledRsvpSchema = TypeCompiler.Compile(RsvpSchema);

export const RsvpSchemaArrayValidator = createValidator(
  RsvpSchemaArray,
  "RsvpSchemaArray",
);

export const RsvpSchemaValidator = createValidator(RsvpSchema, "RsvpSchema");
