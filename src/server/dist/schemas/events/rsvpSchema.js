"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsvpSchemaValidator = exports.RsvpSchemaArrayValidator = exports.CompiledRsvpSchema = exports.RsvpSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const eventSchema_1 = require("./eventSchema");
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const eventAttendantsSchema_1 = require("./eventAttendantsSchema");
exports.RsvpSchema = typebox_1.Type.Object({
    group_name: typebox_1.Type.String(),
    attendance_status: eventAttendantsSchema_1.EventAttendantStatusSchema,
    group_id: typebox_1.Type.String({ format: "uuid" }),
    event_id: typebox_1.Type.String({ format: "uuid" }),
    event_title: typebox_1.Type.String(),
    location: typebox_1.Type.String(),
    starts_at: typebox_1.Type.String({ format: "date-time" }),
    starts_at_ms: typebox_1.Type.Integer({ minimum: 0 }),
    scheduled_status: eventSchema_1.EventStatusSchema,
    group_slug: typebox_1.Type.String(),
});
const RsvpSchemaArray = typebox_1.Type.Array(exports.RsvpSchema);
exports.CompiledRsvpSchema = compiler_1.TypeCompiler.Compile(exports.RsvpSchema);
exports.RsvpSchemaArrayValidator = (0, validateSchema_1.createValidator)(RsvpSchemaArray, "RsvpSchemaArray");
exports.RsvpSchemaValidator = (0, validateSchema_1.createValidator)(exports.RsvpSchema, "RsvpSchema");
//# sourceMappingURL=rsvpSchema.js.map