import { Type, Static } from "@sinclair/typebox";

const EventSchema = Type.Object({
    img: Type.Optional(Type.String()),
    tag: Type.String(),
    title: Type.String(),
    description: Type.String(),
    authors: Type.Array(Type.Object({
        name: Type.String(),
        avatar: Type.String()
    }))
});

const EventsArraySchema = Type.Array(EventSchema);

const EventsReponseSchema = Type.Object({
    items: Type.Array(EventSchema),
    meta: Type.Object({
        page: Type.Number(),
        limit: Type.Number(),
        total: Type.Number()
    })
});

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;

type EventsReponseSchemaType = Static<typeof EventsReponseSchema>;

export { EventSchema, EventsArraySchema, EventsReponseSchema };

export type { EventSchemaType, EventsArraySchemaType, EventsReponseSchemaType };