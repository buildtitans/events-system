import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { createValidator } from "@/src/lib/utils/validation/validateSchema";
import {
  typeboxInput,
  typeboxInputV2,
} from "@/src/server/src/router/adaptors/typeBoxValidation";

const EventAttendantStatusSchema = Type.Union([
  Type.Literal("going"),
  Type.Literal("not_going"),
  Type.Literal("interested"),
]);

const EventAttendantsSchema = Type.Object({
  event_id: Type.String({ format: "uuid" }),
  user_id: Type.String({ format: "uuid" }),
  status: EventAttendantStatusSchema,
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.Union([Type.Null(), Type.String({ format: "date-time" })]),
});

const EventAttendantKeySchema = Type.Object({
  event_id: Type.String({ format: "uuid" }),
  user_id: Type.String({ format: "uuid" }),
});

const EventIdSchema = Type.String();

const EventIdsSchema = Type.Array(EventIdSchema);

const AttendanceUpdateInputSchema = Type.Object({
  event_id: EventIdSchema,
  newStatus: EventAttendantStatusSchema,
});

const UpdatedAttendanceResponseSchema = Type.Union([
  EventAttendantsSchema,
  Type.Null(),
]);

type EventIdsSchemaType = Static<typeof EventIdsSchema>;

type UpdatedAttendanceResponseSchemaType = Static<
  typeof UpdatedAttendanceResponseSchema
>;

type AttendanceUpdateInputSchemaType = Static<
  typeof AttendanceUpdateInputSchema
>;

type EventIdSchemaType = Static<typeof EventIdSchema>;

type EventAttendantsSchemaType = Static<typeof EventAttendantsSchema>;

type EventAttendantStatusSchemaType = Static<typeof EventAttendantStatusSchema>;

type EventAttendantKeySchemaType = Static<typeof EventAttendantKeySchema>;

const CompiledEventIdsSchema = TypeCompiler.Compile(EventIdsSchema);

export const UpdatedAttendanceResponseValidator = typeboxInputV2(
  UpdatedAttendanceResponseSchema,
);

const EventIdSchemaValidator = TypeCompiler.Compile(EventIdSchema);

const EventAttendantsSchemaValidator = TypeCompiler.Compile(
  EventAttendantsSchema,
);

const EventAttendantsStatusSchemaValidator = TypeCompiler.Compile(
  EventAttendantStatusSchema,
);

const AttendanceUpdateInputSchemaValidator = TypeCompiler.Compile(
  AttendanceUpdateInputSchema,
);

export const UpdateAttendanceInputValidator =
  typeboxInput<AttendanceUpdateInputSchemaType>(
    AttendanceUpdateInputSchemaValidator,
  );

const CompiledEventIdSchema = TypeCompiler.Compile(EventIdSchema);

export const EventIdInputValidator = typeboxInput<EventIdsSchemaType>(
  CompiledEventIdsSchema,
);

export const EventIDValidator = typeboxInput<EventIdSchemaType>(
  CompiledEventIdSchema,
);

const ValidateRawAttendants = createValidator(
  EventAttendantsSchema,
  "EventAttendantsSchema",
);

export const RsvpStatusSchemaValidator = createValidator(
  EventAttendantStatusSchema,
  "EventAttendantStatusSchema",
);

export type {
  EventAttendantsSchemaType,
  EventAttendantStatusSchemaType,
  EventIdSchemaType,
  EventAttendantKeySchemaType,
  AttendanceUpdateInputSchemaType,
  UpdatedAttendanceResponseSchemaType,
  EventIdsSchemaType,
};

export {
  EventAttendantsSchema,
  EventAttendantStatusSchema,
  EventIdSchema,
  EventIdsSchema,
  EventAttendantKeySchema,
  AttendanceUpdateInputSchema,
  UpdatedAttendanceResponseSchema,
};

export {
  CompiledEventIdsSchema,
  EventIdSchemaValidator,
  EventAttendantsSchemaValidator,
  EventAttendantsStatusSchemaValidator,
  AttendanceUpdateInputSchemaValidator,
};

export { ValidateRawAttendants };
