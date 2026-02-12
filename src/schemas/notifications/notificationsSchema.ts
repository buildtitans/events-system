import { createValidator } from "@/src/lib/utils/validation/validateSchema";
import { Type, Static } from "@sinclair/typebox";

export const NotificationSchema = Type.Object({
    created_at: Type.String({ format: "date-time" }),
    group_id: Type.String({ format: "uuid" }),
    id: Type.String({ format: "uuid" }),
    message: Type.String(),
    priority: Type.String(),
    seen: Type.Boolean(),
    updated_at: Type.String({ format: "date-time" }),
    user_id: Type.String({ format: "uuid" }),
});

export type NotificationSchemaType = Static<typeof NotificationSchema>;

export const NotificationSchemaArray = Type.Array(NotificationSchema);

export type NotificationSchemaArrayType = Static<typeof NotificationSchemaArray>;

export const NotificationSchemaValidator = createValidator(NotificationSchema, "NotificationsSchema");

export const NotificationSchemaArrayValidator = createValidator(NotificationSchemaArray, "NotificationSchemaArray");