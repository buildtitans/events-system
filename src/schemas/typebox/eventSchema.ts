import { Type, Static } from "@sinclair/typebox";

const EventSchema = Type.Object({
    img: Type.Optional(Type.String()),
    tag: Type.String(),
    title: Type.String(),
    description: Type.String(),
    authors: Type.Optional(Type.Object({
        name: Type.String(),
        avatar: Type.String()
    }))
});

const EventsArraySchema = Type.Array(EventSchema);

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;


export { EventSchema, EventsArraySchema };

export type { EventSchemaType, EventsArraySchemaType };