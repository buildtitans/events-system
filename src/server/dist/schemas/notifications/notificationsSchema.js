"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledViewedNotificationsIdsSchema = exports.CompiledNotificationSchema = exports.CompiledNotificationSchemaArray = exports.CompiledCreateNotificationSchema = exports.NotificationSchemaArray = exports.CreateNotificationSchema = exports.NotificationSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
exports.NotificationSchema = typebox_1.Type.Object({
    created_at: typebox_1.Type.String({ format: "date-time" }),
    group_id: typebox_1.Type.String({ format: "uuid" }),
    id: typebox_1.Type.String({ format: "uuid" }),
    subject: typebox_1.Type.String(),
    message: typebox_1.Type.String(),
    priority: typebox_1.Type.String(),
    status: typebox_1.Type.Union([typebox_1.Type.Literal("new"), typebox_1.Type.Literal("viewed")]),
    updated_at: typebox_1.Type.Union([typebox_1.Type.String({ format: "date-time" }), typebox_1.Type.Null()]),
    user_id: typebox_1.Type.String({ format: "uuid" }),
});
exports.CreateNotificationSchema = typebox_1.Type.Object({
    group_id: typebox_1.Type.String({ format: "uuid" }),
    priority: typebox_1.Type.String(),
    message: typebox_1.Type.String(),
    subject: typebox_1.Type.String(),
});
const ViewedNotificationsIdsSchema = typebox_1.Type.Array(typebox_1.Type.String());
exports.NotificationSchemaArray = typebox_1.Type.Array(exports.NotificationSchema);
exports.CompiledCreateNotificationSchema = compiler_1.TypeCompiler.Compile(exports.CreateNotificationSchema);
exports.CompiledNotificationSchemaArray = compiler_1.TypeCompiler.Compile(exports.NotificationSchemaArray);
exports.CompiledNotificationSchema = compiler_1.TypeCompiler.Compile(exports.NotificationSchema);
exports.CompiledViewedNotificationsIdsSchema = compiler_1.TypeCompiler.Compile(ViewedNotificationsIdsSchema);
//# sourceMappingURL=notificationsSchema.js.map