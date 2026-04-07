"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRawAttendants = exports.AttendanceUpdateInputSchemaValidator = exports.EventAttendantsStatusSchemaValidator = exports.EventAttendantsSchemaValidator = exports.EventIdSchemaValidator = exports.CompiledEventIdsSchema = exports.UpdatedAttendanceResponseSchema = exports.AttendanceUpdateInputSchema = exports.EventAttendantKeySchema = exports.EventIdsSchema = exports.EventIdSchema = exports.EventAttendantStatusSchema = exports.EventAttendantsSchema = exports.RsvpStatusSchemaValidator = exports.EventIDValidator = exports.EventIdInputValidator = exports.UpdateAttendanceInputValidator = exports.UpdatedAttendanceResponseValidator = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const typeBoxValidation_1 = require("@/src/server/core/router/adaptors/typeBoxValidation");
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
exports.UpdatedAttendanceResponseValidator = (0, typeBoxValidation_1.typeboxInputV2)(UpdatedAttendanceResponseSchema);
const EventIdSchemaValidator = compiler_1.TypeCompiler.Compile(EventIdSchema);
exports.EventIdSchemaValidator = EventIdSchemaValidator;
const EventAttendantsSchemaValidator = compiler_1.TypeCompiler.Compile(EventAttendantsSchema);
exports.EventAttendantsSchemaValidator = EventAttendantsSchemaValidator;
const EventAttendantsStatusSchemaValidator = compiler_1.TypeCompiler.Compile(EventAttendantStatusSchema);
exports.EventAttendantsStatusSchemaValidator = EventAttendantsStatusSchemaValidator;
const AttendanceUpdateInputSchemaValidator = compiler_1.TypeCompiler.Compile(AttendanceUpdateInputSchema);
exports.AttendanceUpdateInputSchemaValidator = AttendanceUpdateInputSchemaValidator;
exports.UpdateAttendanceInputValidator = (0, typeBoxValidation_1.typeboxInput)(AttendanceUpdateInputSchemaValidator);
const CompiledEventIdSchema = compiler_1.TypeCompiler.Compile(EventIdSchema);
exports.EventIdInputValidator = (0, typeBoxValidation_1.typeboxInput)(CompiledEventIdsSchema);
exports.EventIDValidator = (0, typeBoxValidation_1.typeboxInput)(CompiledEventIdSchema);
const ValidateRawAttendants = (0, validateSchema_1.createValidator)(EventAttendantsSchema, "EventAttendantsSchema");
exports.ValidateRawAttendants = ValidateRawAttendants;
exports.RsvpStatusSchemaValidator = (0, validateSchema_1.createValidator)(EventAttendantStatusSchema, "EventAttendantStatusSchema");
//# sourceMappingURL=eventAttendantsSchema.js.map