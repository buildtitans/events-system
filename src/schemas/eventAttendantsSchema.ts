import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { createValidator } from "../server/validation/validateSchema";

const EventAttendantStatusSchema = Type.Union([
    Type.Literal("going"),
    Type.Literal("not_going"),
    Type.Literal("interested")
]);

const EventAttendantsSchema = Type.Object({
    event_id: Type.String(),
    user_id: Type.String(),
    status: EventAttendantStatusSchema,
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.Union([
        Type.Null(),
        Type.String({ format: 'date-time' })
    ])
});

const EventIdSchema = Type.String();

type EventIdSchemaType = Static<typeof EventIdSchema>;

type EventAttendantsSchemaType = Static<typeof EventAttendantsSchema>;

type EventAttendantStatusSchemaType = Static<typeof EventAttendantStatusSchema>;


export type { EventAttendantsSchemaType, EventAttendantStatusSchemaType, EventIdSchemaType };

export { EventAttendantsSchema, EventAttendantStatusSchema, EventIdSchema };

export const EventIdSchemaValidator = TypeCompiler.Compile(EventIdSchema);

export const EventAttendantsSchemaValidator = TypeCompiler.Compile(EventAttendantsSchema);

export const EventAttendantsStatusSchemaValidator = TypeCompiler.Compile(EventAttendantStatusSchema);

export const ValidateRawAttendants = createValidator(EventAttendantsSchema, "EventAttendantsSchema");

