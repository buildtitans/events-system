import { Type, Static } from "@sinclair/typebox";

const AuthorSchema = Type.Object({
    name: Type.String(),
    avatar: Type.String(),
});

const AuthorsSchema = Type.Array(AuthorSchema);

type AuthorsSchemaType = Static<typeof AuthorsSchema>

const EventSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
    group_id: Type.String({ format: "uuid" }),
    starts_at: Type.String({ format: "date-time" }),
    img: Type.Union([Type.String(), Type.Null()]),
    tag: Type.String(),
    title: Type.String(),
    description: Type.String(),
    authors: Type.Array(AuthorsSchema),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" })
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

export { EventSchema, EventsArraySchema, EventsReponseSchema, AuthorSchema, AuthorsSchema };

export type { EventSchemaType, EventsArraySchemaType, EventsReponseSchemaType, AuthorsSchemaType };