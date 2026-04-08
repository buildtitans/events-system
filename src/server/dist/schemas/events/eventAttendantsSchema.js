"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceUpdateInputSchemaValidator = exports.EventAttendantsStatusSchemaValidator = exports.EventAttendantsSchemaValidator = exports.EventIdSchemaValidator = exports.CompiledEventIdsSchema = exports.UpdatedAttendanceResponseSchema = exports.AttendanceUpdateInputSchema = exports.EventAttendantKeySchema = exports.EventIdsSchema = exports.EventIdSchema = exports.EventAttendantStatusSchema = exports.EventAttendantsSchema = exports.CompiledEventIdSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const EventAttendantStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal("going"),
    typebox_1.Type.Literal("not_going"),
    typebox_1.Type.Literal("interested"),
]);
exports.EventAttendantStatusSchema = EventAttendantStatusSchema;
const EventAttendantsSchema = typebox_1.Type.Object({
    event_id: typebox_1.Type.String({ format: "uuid" }),
    user_id: typebox_1.Type.String({ format: "uuid" }),
    status: EventAttendantStatusSchema,
    created_at: typebox_1.Type.String({ format: "date-time" }),
    updated_at: typebox_1.Type.Union([typebox_1.Type.Null(), typebox_1.Type.String({ format: "date-time" })]),
});
exports.EventAttendantsSchema = EventAttendantsSchema;
const EventAttendantKeySchema = typebox_1.Type.Object({
    event_id: typebox_1.Type.String({ format: "uuid" }),
    user_id: typebox_1.Type.String({ format: "uuid" }),
});
exports.EventAttendantKeySchema = EventAttendantKeySchema;
const EventIdSchema = typebox_1.Type.String();
exports.EventIdSchema = EventIdSchema;
const EventIdsSchema = typebox_1.Type.Array(EventIdSchema);
exports.EventIdsSchema = EventIdsSchema;
const AttendanceUpdateInputSchema = typebox_1.Type.Object({
    event_id: EventIdSchema,
    newStatus: EventAttendantStatusSchema,
});
exports.AttendanceUpdateInputSchema = AttendanceUpdateInputSchema;
const UpdatedAttendanceResponseSchema = typebox_1.Type.Union([
    EventAttendantsSchema,
    typebox_1.Type.Null(),
]);
exports.UpdatedAttendanceResponseSchema = UpdatedAttendanceResponseSchema;
const CompiledEventIdsSchema = compiler_1.TypeCompiler.Compile(EventIdsSchema);
exports.CompiledEventIdsSchema = CompiledEventIdsSchema;
const EventIdSchemaValidator = compiler_1.TypeCompiler.Compile(EventIdSchema);
exports.EventIdSchemaValidator = EventIdSchemaValidator;
const EventAttendantsSchemaValidator = compiler_1.TypeCompiler.Compile(EventAttendantsSchema);
exports.EventAttendantsSchemaValidator = EventAttendantsSchemaValidator;
const EventAttendantsStatusSchemaValidator = compiler_1.TypeCompiler.Compile(EventAttendantStatusSchema);
exports.EventAttendantsStatusSchemaValidator = EventAttendantsStatusSchemaValidator;
const AttendanceUpdateInputSchemaValidator = compiler_1.TypeCompiler.Compile(AttendanceUpdateInputSchema);
exports.AttendanceUpdateInputSchemaValidator = AttendanceUpdateInputSchemaValidator;
exports.CompiledEventIdSchema = compiler_1.TypeCompiler.Compile(EventIdSchema);
//# sourceMappingURL=eventAttendantsSchema.js.map