"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledRsvpSchema = exports.RsvpSchemaArray = exports.RsvpSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const eventSchema_1 = require("./eventSchema");
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
exports.RsvpSchemaArray = typebox_1.Type.Array(exports.RsvpSchema);
exports.CompiledRsvpSchema = compiler_1.TypeCompiler.Compile(exports.RsvpSchema);
//# sourceMappingURL=rsvpSchema.js.map