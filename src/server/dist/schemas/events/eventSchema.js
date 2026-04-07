"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventArgsSchemaValidator = exports.GroupIdSchemaValidator = exports.NewEventInputValidator = exports.NewEventInputSchemaValidator = exports.UpdateEventArgsSchema = exports.GroupIdSchema = exports.NewEventInputSchema = exports.EventsReponseSchema = exports.EventsArraySchema = exports.EventSchema = exports.EventSearchSchema = exports.EventsByGroupIdSchema = exports.GroupIdArraySchema = exports.EventStatusSchema = void 0;
const typeBoxValidation_1 = require("@/src/server/core/router/adaptors/typeBoxValidation");
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
exports.EventStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal("scheduled"),
    typebox_1.Type.Literal("cancelled"),
]);
const EventSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    group_id: typebox_1.Type.String(),
    status: exports.EventStatusSchema,
    starts_at: typebox_1.Type.String(),
    starts_at_ms: typebox_1.Type.Integer({ minimum: 0 }),
    img: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    tag: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String(),
    meeting_location: typebox_1.Type.String(),
    created_at: typebox_1.Type.String({ format: "date-time" }),
    updated_at: typebox_1.Type.Union([typebox_1.Type.String({ format: "date-time" }), typebox_1.Type.Null()]),
});
exports.EventSchema = EventSchema;
const GroupIdSchema = typebox_1.Type.String();
exports.GroupIdSchema = GroupIdSchema;
exports.GroupIdArraySchema = typebox_1.Type.Array(GroupIdSchema);
const NewEventInputSchema = typebox_1.Type.Object({
    group_id: typebox_1.Type.String(),
    starts_at: typebox_1.Type.String(),
    img: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    tag: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String(),
    meeting_location: typebox_1.Type.String(),
});
exports.NewEventInputSchema = NewEventInputSchema;
const EventsArraySchema = typebox_1.Type.Array(EventSchema);
exports.EventsArraySchema = EventsArraySchema;
const EventsReponseSchema = typebox_1.Type.Object({
    items: EventsArraySchema,
    meta: typebox_1.Type.Object({
        total: typebox_1.Type.Number(),
    }),
});
exports.EventsReponseSchema = EventsReponseSchema;
exports.EventsByGroupIdSchema = typebox_1.Type.Record(typebox_1.Type.String(), EventsArraySchema);
const UpdateEventArgsSchema = typebox_1.Type.Object({
    event_id: typebox_1.Type.String({ format: "uuid" }),
    status: exports.EventStatusSchema,
    organizer_id: typebox_1.Type.String({ format: "uuid" }),
    group_id: typebox_1.Type.String({ format: "uuid" }),
});
exports.UpdateEventArgsSchema = UpdateEventArgsSchema;
exports.EventSearchSchema = typebox_1.Type.String();
exports.NewEventInputSchemaValidator = compiler_1.TypeCompiler.Compile(NewEventInputSchema);
exports.NewEventInputValidator = (0, typeBoxValidation_1.typeboxInput)(exports.NewEventInputSchemaValidator);
exports.GroupIdSchemaValidator = compiler_1.TypeCompiler.Compile(GroupIdSchema);
exports.UpdateEventArgsSchemaValidator = compiler_1.TypeCompiler.Compile(UpdateEventArgsSchema);
//# sourceMappingURL=eventSchema.js.map