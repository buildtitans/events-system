"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchemaArrayValidator = exports.NotificationSchemaValidator = exports.NotificationArrayInputValidator = exports.SeenNotificationsInputValidator = exports.CompiledViewedNotificationsIdsSchema = exports.CompiledNotificationSchema = exports.CompiledNotificationSchemaArray = exports.createNotificationInput = exports.CompiledCreateNotificationSchema = exports.NotificationSchemaArray = exports.CreateNotificationSchema = exports.NotificationSchema = void 0;
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const typeBoxValidation_1 = require("@/src/server/core/router/adaptors/typeBoxValidation");
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
exports.createNotificationInput = (0, typeBoxValidation_1.typeboxInput)(exports.CompiledCreateNotificationSchema);
exports.CompiledNotificationSchemaArray = compiler_1.TypeCompiler.Compile(exports.NotificationSchemaArray);
exports.CompiledNotificationSchema = compiler_1.TypeCompiler.Compile(exports.NotificationSchema);
exports.CompiledViewedNotificationsIdsSchema = compiler_1.TypeCompiler.Compile(ViewedNotificationsIdsSchema);
exports.SeenNotificationsInputValidator = (0, typeBoxValidation_1.typeboxInput)(exports.CompiledViewedNotificationsIdsSchema);
exports.NotificationArrayInputValidator = (0, typeBoxValidation_1.typeboxInput)(exports.CompiledNotificationSchemaArray);
exports.NotificationSchemaValidator = (0, validateSchema_1.createValidator)(exports.NotificationSchema, "NotificationsSchema");
exports.NotificationSchemaArrayValidator = (0, validateSchema_1.createValidator)(exports.NotificationSchemaArray, "NotificationSchemaArray");
//# sourceMappingURL=notificationsSchema.js.map