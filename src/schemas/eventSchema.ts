import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const AuthorSchema = Type.Object({
    name: Type.String(),
    avatar: Type.String(),
});

const AuthorsSchema = Type.Array(AuthorSchema);

type AuthorsSchemaType = Static<typeof AuthorsSchema>

const EventSchema = Type.Object({
    id: Type.String(),
    group_id: Type.String(),
    starts_at: Type.String({ format: "date-time" }),
    img: Type.Union([Type.String(), Type.Null()]),
    tag: Type.Union([Type.String(), Type.Null()]),
    title: Type.String(),
    description: Type.String(),
    authors: AuthorsSchema,
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()])
});

const NewEventInputSchema = Type.Object({
    group_id: Type.String(),
    starts_at: Type.String({ format: "date-time" }),
    img: Type.Union([Type.String(), Type.Null()]),
    tag: Type.Union([Type.String(), Type.Null()]),
    title: Type.String(),
    description: Type.String(),
    authors: AuthorsSchema,
});

const EventsArraySchema = Type.Array(EventSchema);

const EventsReponseSchema = Type.Object({
    items: EventsArraySchema,
    meta: Type.Object({
        total: Type.Number()
    })
});

type NewEventInputSchemaType = Static<typeof NewEventInputSchema>;

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;

type EventsReponseSchemaType = Static<typeof EventsReponseSchema>;

export { EventSchema, EventsArraySchema, EventsReponseSchema, AuthorSchema, AuthorsSchema, NewEventInputSchema };

export type { EventSchemaType, EventsArraySchemaType, EventsReponseSchemaType, AuthorsSchemaType, NewEventInputSchemaType };


export const NewEventInputSchemaValidator = TypeCompiler.Compile(NewEventInputSchema);