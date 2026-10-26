import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { EventSchema, GroupEventSummarySchema } from "../events/eventSchema";
import { CategorySchema } from "./categoriesSchema";
import { EventHeadCountSchema } from "../events/eventAttendantsSchema";
import { PaginatedLayoutSchema } from "../events/layoutSlotSchema";
import { GroupMemberSchema } from "./groupMembersSchema";
import { TimelineSchema } from "./timelineSchema";

export const GroupSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  location: Type.Union([Type.String(), Type.Null()]),
  category_id: CategorySchema.properties.id,
  organizer_id: Type.String({ format: "uuid" }),
  created_at: Type.String(),
  updated_at: Type.String(),
});

const NextEventSchema = Type.Pick(EventSchema, [
  "id",
  "group_id",
  "status",
  "starts_at",
  "starts_at_ms",
  "img",
  "description",
  "tag",
  "title",
  "meeting_location",
]);

const GroupSummarySchema = Type.Omit(GroupSchema, [
  "organizer_id",
  "created_at",
  "updated_at",
  "category_id",
]);

const GroupMemberCountSchema = Type.Integer({ minimum: 0 });

const NextEventMetadataSchema = Type.Object({
  attendance: EventHeadCountSchema,
  category_name: CategorySchema.properties.name,
});

const GroupDiscoveryNextEvent = Type.Object({
  event: Type.Pick(EventSchema, [
    "id",
    "title",
    "description",
    "starts_at",
    "starts_at_ms",
  ]),
  meta: Type.Pick(NextEventMetadataSchema, ["attendance"]),
});

const GroupDiscoverySummaryMetadata = Type.Object(
  {
    category_name: CategorySchema.properties.name,
    member_count: GroupMemberCountSchema,
    kind: Type.Literal("no_next_event"),
  },
  { additionalProperties: false },
);

const GroupDiscoveryMetadataWithNextEvent = Type.Object(
  {
    category_name: CategorySchema.properties.name,
    member_count: GroupMemberCountSchema,
    next_event: GroupDiscoveryNextEvent,
    kind: Type.Literal("has_next_event"),
  },
  { additionalProperties: false },
);

const GroupDiscoverySummaryMeta = Type.Union([
  GroupDiscoveryMetadataWithNextEvent,
  GroupDiscoverySummaryMetadata,
]);

export const GroupDiscoverySummarySchema = Type.Object({
  group: GroupSummarySchema,
  meta: GroupDiscoverySummaryMeta,
});

export const GroupDiscoverySchema = Type.Array(GroupDiscoverySummarySchema);

export type GroupDiscoverySummarySchemaType = Static<
  typeof GroupDiscoverySummarySchema
>;

export const NextEventForGroupSummarySchema = Type.Object({
  event: NextEventSchema,
  meta: NextEventMetadataSchema,
});

export type NextEventForGroupSummarySchemaType = Static<
  typeof NextEventForGroupSummarySchema
>;

export const GroupEventMetadata = Type.Object({
  next_event: Type.Optional(NextEventForGroupSummarySchema),
  group_events: PaginatedLayoutSchema,
  calandar: TimelineSchema,
});

export type GroupEventMetadataType = Static<typeof GroupEventMetadata>;

const GroupMetadataSchema = Type.Object({
  events: GroupEventMetadata,
  member_count: GroupMemberCountSchema,
  organizer_email: Type.String({ format: "email" }),
  category_name: CategorySchema.properties.name,
  viewer_role: GroupMemberSchema.properties.role,
});

const GroupHydrationReadMetadata = Type.Object({
  member_count: GroupMemberCountSchema,
  organizer_email: Type.String({ format: "email" }),
  category_name: CategorySchema.properties.name,
  viewer_role: GroupMemberSchema.properties.role,
  next_event: Type.Optional(NextEventForGroupSummarySchema),
  group_events: Type.Array(GroupEventSummarySchema),
  calandar: TimelineSchema,
});

export const GroupRefreshReadSchema = Type.Pick(GroupHydrationReadMetadata, [
  "next_event",
  "group_events",
  "calandar",
]);

export type GroupRefreshReadSchemaType = Static<typeof GroupRefreshReadSchema>;

export const GroupHydratedSchema = Type.Object({
  group: GroupSchema,
  meta: GroupMetadataSchema,
});

export const GroupHydrationReadSchema = Type.Object({
  group: GroupSchema,
  meta: GroupHydrationReadMetadata,
});

export type GroupHydrationReadSchemaType = Static<
  typeof GroupHydrationReadSchema
>;

export type GroupHydratedSchemaType = Static<typeof GroupHydratedSchema>;

export const GroupRefreshSchema = Type.Object({
  next_event: Type.Optional(NextEventForGroupSummarySchema),

  group_events: PaginatedLayoutSchema,
  calandar: TimelineSchema,
});

export type GroupRefreshSchemaType = Static<typeof GroupRefreshSchema>;

export const NewGroupInputSchema = Type.Object({
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  location: Type.Union([Type.String(), Type.Null()]),
  category_id: Type.Union([Type.String(), Type.Null()]),
});

export const ArchivedEventSchema = Type.Object({
  event: EventSchema,
  attendance: Type.Object({
    going: Type.Number(),
    interested: Type.Number(),
  }),
});

export const GroupArchivesSchema = Type.Array(ArchivedEventSchema);

export type ArchivedEventSchemaType = Static<typeof ArchivedEventSchema>;

export const GroupSlugSchema = Type.String();

export type GroupSlugSchemaType = Static<typeof GroupSlugSchema>;

export const CompiledGroupSlugSchema = TypeCompiler.Compile(GroupSlugSchema);

export const CompiledNewGroupInputSchema =
  TypeCompiler.Compile(NewGroupInputSchema);

export type NewGroupInputSchemaType = Static<typeof NewGroupInputSchema>;

export const GroupsSchema = Type.Array(GroupSchema);

export type GroupSchemaType = Static<typeof GroupSchema>;

export type GroupsSchemaType = Static<typeof GroupsSchema>;

export const CompiledGroupSchema = TypeCompiler.Compile(GroupSchema);
