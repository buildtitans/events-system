import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";


const EventAttendantsSchema = Type.Object({
    event_id: Type.String(),
    user_id: Type.String(),
    status: Type.Union([
        Type.Literal("going"),
        Type.Literal("not_going"),
        Type.Literal("interested")
    ]),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.Union([
        Type.Null(),
        Type.String({ format: 'date-time' })
    ])
});


type EventAttendantsSchemaType = Static<typeof EventAttendantsSchema>;


export type { EventAttendantsSchemaType };

export { EventAttendantsSchema };

export const EventAttendantsSchemaValidator = TypeCompiler.Compile(EventAttendantsSchema);