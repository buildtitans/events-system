import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { GroupSchema } from "../groups/groupSchema";

const PrioritySchema = Type.Union([
  Type.Literal("high"),
  Type.Literal("moderate"),
  Type.Literal("low"),
]);

export const NotificationSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  group_id: Type.String({ format: "uuid" }),
  subject: Type.String(),
  message: Type.String(),
  priority: PrioritySchema,
  status: Type.Union([Type.Literal("new"), Type.Literal("viewed")]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  user_id: Type.String({ format: "uuid" }),
});

const NotificationMetadataSchema = Type.Object({
  group_slug: GroupSchema.properties.slug,
  group_name: GroupSchema.properties.name,
});

const NewNotification = Type.Object({
  created_at: Type.String({ format: "date-time" }),
  group_id: Type.String({ format: "uuid" }),
  id: Type.String({ format: "uuid" }),
  subject: Type.String(),
  message: Type.String(),
  priority: PrioritySchema,
  status: Type.Literal("new"),
  updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  user_id: Type.String({ format: "uuid" }),
});

const NewNotificationSchema = Type.Object({
  kind: Type.Literal("new"),
  data: NewNotification,
  meta: NotificationMetadataSchema,
});

const ViewedNotification = Type.Object({
  created_at: Type.String({ format: "date-time" }),
  group_id: Type.String({ format: "uuid" }),
  id: Type.String({ format: "uuid" }),
  subject: Type.String(),
  message: Type.String(),
  priority: PrioritySchema,
  status: Type.Literal("viewed"),
  updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  user_id: Type.String({ format: "uuid" }),
});

const ViewedNotificationSchema = Type.Object({
  kind: Type.Literal("seen"),
  data: ViewedNotification,
  meta: NotificationMetadataSchema,
});

export const UserNotificationsSchema = Type.Object({
  new: Type.Array(NewNotificationSchema),
  seen: Type.Array(ViewedNotificationSchema),
});

export type UserNotificationSchemaType =
  | UserNotificationsSchemaType["new"][number]
  | UserNotificationsSchemaType["seen"][number];

export type UserNotificationsSchemaType = Static<
  typeof UserNotificationsSchema
>;

export const CreateNotificationSchema = Type.Object({
  group_id: Type.String({ format: "uuid" }),
  priority: PrioritySchema,
  message: Type.String(),
  subject: Type.String(),
});

export const NotificationIdsSchema = Type.Array(Type.String({ minLength: 1 }), {
  minItems: 1,
  maxItems: 100,
  uniqueItems: true,
});

export type NotificationIdsSchemaType = Static<typeof NotificationIdsSchema>;

export const CompiledNotificationIdsSchema = TypeCompiler.Compile(
  NotificationIdsSchema,
);

const ViewedNotificationsIdsSchema = Type.Array(Type.String());

export type ViewedNotificationsIdsSchemaType = Static<
  typeof ViewedNotificationsIdsSchema
>;

export const NotificationSchemaArray = Type.Array(NotificationSchema);

export type NotificationSchemaArrayType = Static<
  typeof NotificationSchemaArray
>;

export type CreateNotificationSchemaType = Static<
  typeof CreateNotificationSchema
>;

export type NotificationSchemaType = Static<typeof NotificationSchema>;

export const CompiledCreateNotificationSchema = TypeCompiler.Compile(
  CreateNotificationSchema,
);

export const CompiledNotificationSchemaArray = TypeCompiler.Compile(
  NotificationSchemaArray,
);

export const CompiledNotificationSchema =
  TypeCompiler.Compile(NotificationSchema);

export const CompiledViewedNotificationsIdsSchema = TypeCompiler.Compile(
  ViewedNotificationsIdsSchema,
);
