import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const AuthorSchema = Type.Object({
    name: Type.String(),
    avatar: Type.String(),
});

const AuthorsSchema = Type.Array(AuthorSchema);

type AuthorsSchemaType = Static<typeof AuthorsSchema>;

const EventStatusSchema = Type.Union([
    Type.Literal("scheduled"), Type.Literal("cancelled")
]);

const EventSchema = Type.Object({
    id: Type.String(),
    group_id: Type.String(),
    status: EventStatusSchema,
    starts_at: Type.String(),
    img: Type.Union([Type.String(), Type.Null()]),
    tag: Type.Union([Type.String(), Type.Null()]),
    title: Type.String(),
    description: Type.String(),
    meeting_location: Type.String(),
    authors: AuthorsSchema,
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()])
});

const GroupIdSchema = Type.String();

const NewEventInputSchema = Type.Object({
    group_id: Type.String(),
    starts_at: Type.String(),
    img: Type.Union([Type.String(), Type.Null()]),
    tag: Type.Union([Type.String(), Type.Null()]),
    title: Type.String(),
    description: Type.String(),
    authors: AuthorsSchema,
    meeting_location: Type.String()
});

const EventsArraySchema = Type.Array(EventSchema);

const EventsReponseSchema = Type.Object({
    items: EventsArraySchema,
    meta: Type.Object({
        total: Type.Number()
    })
});

const UpdateEventArgsSchema = Type.Object({
    event_id: Type.String({ format: "uuid" }),
    status: EventStatusSchema,
    organizer_id: Type.String({ format: "uuid" })
});

type UpdateEventArgsSchemaType = Static<typeof UpdateEventArgsSchema>;

type GroupIdSchemaType = Static<typeof GroupIdSchema>;

type NewEventInputSchemaType = Static<typeof NewEventInputSchema>;

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;

type EventsReponseSchemaType = Static<typeof EventsReponseSchema>;

export { EventSchema, EventsArraySchema, EventsReponseSchema, AuthorSchema, AuthorsSchema, NewEventInputSchema, GroupIdSchema, UpdateEventArgsSchema };

export type { EventSchemaType, EventsArraySchemaType, EventsReponseSchemaType, AuthorsSchemaType, NewEventInputSchemaType, GroupIdSchemaType, UpdateEventArgsSchemaType };


export const NewEventInputSchemaValidator = TypeCompiler.Compile(NewEventInputSchema);

export const GroupIdSchemaValidator = TypeCompiler.Compile(GroupIdSchema);

export const UpdateEventArgsSchemaValidator = TypeCompiler.Compile(UpdateEventArgsSchema);