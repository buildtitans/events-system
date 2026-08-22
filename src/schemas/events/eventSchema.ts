import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const EVENT_TAG_MAX_LENGTH = 24;

const EventTagSchema = Type.Union([
  Type.String({
    maxLength: EVENT_TAG_MAX_LENGTH,
    pattern: "^\\s*\\S+(?:\\s+\\S+)?\\s*$",
  }),
  Type.Null(),
]);

export const EventStatusSchema = Type.Union([
  Type.Literal("scheduled"),
  Type.Literal("cancelled"),
]);

const EventSchema = Type.Object({
  id: Type.String(),
  group_id: Type.String(),
  status: EventStatusSchema,
  starts_at: Type.String(),
  starts_at_ms: Type.Integer({ minimum: 0 }),
  img: Type.String(),
  tag: EventTagSchema,
  title: Type.String(),
  description: Type.String(),
  meeting_location: Type.String(),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
});

const GroupIdSchema = Type.String();

export const GroupIdArraySchema = Type.Array(GroupIdSchema);

export type GroupIdArraySchema = Static<typeof GroupIdArraySchema>;

const NonEmptyString = Type.String({ minLength: 1 });

const NewEventInputSchema = Type.Object({
  group_id: NonEmptyString,
  starts_at: Type.String({ minLength: 1 }),
  title: NonEmptyString,
  description: Type.String(),
  meeting_location: Type.String(),
  img: Type.Union([NonEmptyString, Type.Null()]),
  tag: EventTagSchema,
});

const EventsArraySchema = Type.Array(EventSchema);

const EventsReponseSchema = Type.Object({
  items: EventsArraySchema,
  meta: Type.Object({
    total: Type.Number(),
  }),
});

export const EventsByGroupIdSchema = Type.Record(
  Type.String(),
  EventsArraySchema,
);

const UpdateEventArgsSchema = Type.Object({
  event_id: Type.String({ format: "uuid" }),
  status: EventStatusSchema,
  organizer_id: Type.String({ format: "uuid" }),
  group_id: Type.String({ format: "uuid" }),
});

export type EventsByGroupIdSchemaType = Static<typeof EventsByGroupIdSchema>;

type UpdateEventArgsSchemaType = Static<typeof UpdateEventArgsSchema>;

type GroupIdSchemaType = Static<typeof GroupIdSchema>;

type NewEventInputSchemaType = Static<typeof NewEventInputSchema>;

type EventSchemaType = Static<typeof EventSchema>;

type EventsArraySchemaType = Static<typeof EventsArraySchema>;

type EventsReponseSchemaType = Static<typeof EventsReponseSchema>;

export {
  EventSchema,
  EventsArraySchema,
  EventsReponseSchema,
  NewEventInputSchema,
  GroupIdSchema,
  UpdateEventArgsSchema,
};

export type {
  EventSchemaType,
  EventsArraySchemaType,
  EventsReponseSchemaType,
  NewEventInputSchemaType,
  GroupIdSchemaType,
  UpdateEventArgsSchemaType,
};

export const NewEventInputSchemaValidator =
  TypeCompiler.Compile(NewEventInputSchema);

export const GroupIdSchemaValidator = TypeCompiler.Compile(GroupIdSchema);

export const UpdateEventArgsSchemaValidator = TypeCompiler.Compile(
  UpdateEventArgsSchema,
);
