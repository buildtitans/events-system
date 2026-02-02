import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { createValidator } from "@/src/lib/utils/validation/validateSchema";

const EventAttendantStatusSchema = Type.Union([
    Type.Literal("going"),
    Type.Literal("not_going"),
    Type.Literal("interested")
]);

const EventAttendantsSchema = Type.Object({
    event_id: Type.String({ format: "uuid" }),
    user_id: Type.String({ format: "uuid" }),
    status: EventAttendantStatusSchema,
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.Union([
        Type.Null(),
        Type.String({ format: 'date-time' })
    ])
});

const EventAttendantKeySchema = Type.Object({
    event_id: Type.String({ format: "uuid" }),
    user_id: Type.String({ format: "uuid" })
});



const EventIdSchema = Type
    .String();

const AttendanceUpdateInputSchema = Type.Object({
    event_id: EventIdSchema,
    newStatus: EventAttendantStatusSchema
});

const UpdatedAttendanceResponseSchema = Type.Union([
    EventAttendantsSchema, Type.Null()
]);

type UpdatedAttendanceResponseSchemaType = Static<typeof UpdatedAttendanceResponseSchema>;

type AttendanceUpdateInputSchemaType = Static<typeof AttendanceUpdateInputSchema>;

type EventIdSchemaType = Static<typeof EventIdSchema>;

type EventAttendantsSchemaType = Static<typeof EventAttendantsSchema>;

type EventAttendantStatusSchemaType = Static<typeof EventAttendantStatusSchema>;

type EventAttendantKeySchemaType = Static<typeof EventAttendantKeySchema>;


const UpdatedAttendanceResponseSchemaValidator = TypeCompiler.Compile(UpdatedAttendanceResponseSchema);

const EventIdSchemaValidator = TypeCompiler.Compile(EventIdSchema);

const EventAttendantsSchemaValidator = TypeCompiler.Compile(EventAttendantsSchema);

const EventAttendantsStatusSchemaValidator = TypeCompiler.Compile(EventAttendantStatusSchema);

const AttendanceUpdateInputSchemaValidator = TypeCompiler.Compile(AttendanceUpdateInputSchema);

const ValidateRawAttendants = createValidator(EventAttendantsSchema, "EventAttendantsSchema");

export type {
    EventAttendantsSchemaType,
    EventAttendantStatusSchemaType,
    EventIdSchemaType,
    EventAttendantKeySchemaType,
    AttendanceUpdateInputSchemaType,
    UpdatedAttendanceResponseSchemaType
};

export {
    EventAttendantsSchema,
    EventAttendantStatusSchema,
    EventIdSchema,
    EventAttendantKeySchema,
    AttendanceUpdateInputSchema,
    UpdatedAttendanceResponseSchema
};

export {
    EventIdSchemaValidator,
    EventAttendantsSchemaValidator,
    EventAttendantsStatusSchemaValidator,
    AttendanceUpdateInputSchemaValidator,
    UpdatedAttendanceResponseSchemaValidator
};

export {
    ValidateRawAttendants
}