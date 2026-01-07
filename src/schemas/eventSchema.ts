import { Type, Static } from "@sinclair/typebox";

const AuthorSchema = Type.Object({
    name: Type.String(),
    avatar: Type.String(),
});

const AuthorsSchema = Type.Array(AuthorSchema);

type AuthorsSchemaType = Static<typeof AuthorsSchema>

const EventSchema = Type.Object({
    id: Type.Optional(Type.String()),
    img: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    tag: Type.String(),
    title: Type.String(),
    description: Type.String(),
    authors: AuthorsSchema,
    created_at: Type.String(),
    updated_at: Type.String()
});

const EventsArraySchema = Type.Array(EventSchema);

const EventsReponseSchema = Type.Object({
    items: EventsArraySchema,
    meta: Type.Object({
        total: Type.Number()
    })
});

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;

type EventsReponseSchemaType = Static<typeof EventsReponseSchema>;

export { EventSchema, EventsArraySchema, EventsReponseSchema, AuthorSchema };

export type { EventSchemaType, EventsArraySchemaType, EventsReponseSchemaType, AuthorsSchemaType };