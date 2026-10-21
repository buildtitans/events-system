import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { GroupSchema } from "../groups/groupSchema";
import { EventSchema } from "../events/eventSchema";
import { CategorySchema } from "../groups/categoriesSchema";
import { EventHeadCountSchema } from "../events/eventAttendantsSchema";

export const SearchSchema = Type.String({
  minLength: 1,
  maxLength: 100,
  pattern: "\\S",
});

export type SearchSchemaType = Static<typeof SearchSchema>;

export const CompiledSearchSchema = TypeCompiler.Compile(SearchSchema);

const GroupMemberCountSchema = Type.Integer({ minimum: 0 });

export const GroupSearchSuggestionSchema = Type.Object({
  kind: Type.Literal("group"),
  data: Type.Object({
    group: Type.Object({
      id: GroupSchema.properties.id,
      slug: GroupSchema.properties.slug,
      description: GroupSchema.properties.description,
      location: GroupSchema.properties.location,
      name: GroupSchema.properties.name,
    }),
    meta: Type.Object({
      label: Type.String({ minLength: 1 }),
      group: Type.Object({
        category_name: CategorySchema.properties.name,
        member_count: GroupMemberCountSchema,
      }),
    }),
  }),
});

export const EventSearchSuggestionSchema = Type.Object({
  kind: Type.Literal("event"),
  data: Type.Object({
    event: Type.Object({
      id: EventSchema.properties.id,
      group_id: EventSchema.properties.group_id,
      title: EventSchema.properties.title,
      starts_at_ms: EventSchema.properties.starts_at_ms,
    }),
    meta: Type.Object({
      label: Type.String({ minLength: 1 }),
      group: Type.Object({
        group_name: GroupSchema.properties.name,
        group_location: GroupSchema.properties.location,
        group_slug: GroupSchema.properties.slug,
      }),
    }),
  }),
});

export const SearchSuggestionSchema = Type.Union([
  GroupSearchSuggestionSchema,
  EventSearchSuggestionSchema,
]);

export type SearchSuggestionSchemaType = Static<typeof SearchSuggestionSchema>;

const CurrentDayEventPhase = Type.Union([
  Type.Literal("ended"),
  Type.Literal("ongoing"),
  Type.Literal("not_yet_held"),
]);

const SearchResultEventSchema = Type.Object({
  id: EventSchema.properties.id,
  title: EventSchema.properties.title,
  group_id: EventSchema.properties.group_id,
  description: EventSchema.properties.description,
  img: EventSchema.properties.img,
  starts_at: EventSchema.properties.starts_at,
  tag: EventSchema.properties.tag,
});

const EventResultMetaData = Type.Object({
  label: Type.String({ minLength: 1 }),
  group: Type.Object({
    group_name: GroupSchema.properties.name,
    group_location: GroupSchema.properties.location,
    group_slug: GroupSchema.properties.slug,
  }),
  attendance: EventHeadCountSchema,
});

const EventResultData = Type.Object({
  event: SearchResultEventSchema,
  meta: EventResultMetaData,
});

const CurrentDayEventResultSchema = Type.Object({
  kind: Type.Literal("event"),
  timeline_status: Type.Literal("today"),
  event_phase: CurrentDayEventPhase,
  data: EventResultData,
});

const PastEventResultSchema = Type.Object({
  kind: Type.Literal("event"),
  timeline_status: Type.Literal("past"),
  data: EventResultData,
});

const FutureEventResultSchema = Type.Object({
  kind: Type.Literal("event"),
  timeline_status: Type.Literal("upcoming"),
  data: EventResultData,
});

export const EventSearchResultSchema = Type.Union([
  FutureEventResultSchema,
  PastEventResultSchema,
  CurrentDayEventResultSchema,
]);

export type EventSearchResultSchemaType = Static<
  typeof EventSearchResultSchema
>;

export const GroupSearchResultSchema = Type.Object({
  kind: Type.Literal("group"),
  data: Type.Object({
    group: Type.Omit(GroupSchema, [
      "created_at",
      "updated_at",
      "organizer_id",
      "category_id",
    ]),
    meta: Type.Object({
      label: Type.String({ minLength: 1 }),
      category_name: CategorySchema.properties.name,
      member_count: GroupMemberCountSchema,
      next_event_scheduled: Type.Optional(Type.String({ format: "date-time" })),
    }),
  }),
});

export const SearchResultSchema = Type.Union([
  EventSearchResultSchema,
  GroupSearchResultSchema,
]);

export type SearchResultSchemaType = Static<typeof SearchResultSchema>;

export const SearchResultsSchema = Type.Array(SearchResultSchema);

export type GroupSearchResultSchemaType = Static<typeof GroupSearchResultSchema>;
export type EventSearchSuggestionSchemaType = Static<typeof EventSearchSuggestionSchema>;
export type GroupSearchSuggestionSchemaType = Static<typeof GroupSearchSuggestionSchema>;
