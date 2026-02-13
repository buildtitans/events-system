import { createValidator } from "@/src/lib/utils/validation/validateSchema";
import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

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

export const CreateNotificationSchema = Type.Object({
    created_at: Type.String({ format: "date-time" }),
    group_id: Type.String({ format: "uuid" }),
    updated_at: Type.String({ format: "date-time" }),
    priority: Type.String(),
    message: Type.String(),
});


export const NotificationSchemaArray = Type.Array(NotificationSchema);

export type NotificationSchemaArrayType = Static<typeof NotificationSchemaArray>;

export type CreateNotificationSchemaType = Static<typeof CreateNotificationSchema>;

export type NotificationSchemaType = Static<typeof NotificationSchema>;

export const CompiledCreateNotificationSchema = TypeCompiler.Compile(CreateNotificationSchema);

export const CompiledNotificationSchemaArray = TypeCompiler.Compile(NotificationSchemaArray);

export const CompiledNotificationSchema = TypeCompiler.Compile(NotificationSchema);

export const NotificationSchemaValidator = createValidator(NotificationSchema, "NotificationsSchema");

export const NotificationSchemaArrayValidator = createValidator(NotificationSchemaArray, "NotificationSchemaArray");