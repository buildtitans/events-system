"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateGroupId = exports.ValidateEventSearchQuery = exports.eventValidator = exports.NewEventSchemaValidator = exports.GroupsSchemaValidator = exports.GroupSchemaValidator = exports.layoutSlotValidator = exports.eventsValidator = exports.CompiledGroupIdsSchema = exports.EventsByGroupIdSchemaValidator = void 0;
exports.createValidator = createValidator;
require("@/src/schemas/format");
const compiler_1 = require("@sinclair/typebox/compiler");
const eventSchema_1 = require("@/src/schemas/events/eventSchema");
const layoutSlotSchema_1 = require("@/src/schemas/events/layoutSlotSchema");
const groupSchema_1 = require("@/src/schemas/groups/groupSchema");
const eventSchema_2 = require("@/src/schemas/events/eventSchema");
const eventSchema_3 = require("@/src/schemas/events/eventSchema");
const eventAttendantsSchema_1 = require("@/src/schemas/events/eventAttendantsSchema");
function preview(value, max = 160) {
    if (value == null)
        return String(value);
    try {
        const s = typeof value === "string" ? value : JSON.stringify(value);
        return s.length > max ? s.slice(0, max) + "…(truncated)" : s;
    }
    catch {
        return "[unserializable]";
    }
}
function formatErrors(errors) {
    return errors
        .map((e, i) => {
        const path = e.path || "(root)";
        return [
            `#${i + 1} ${path}`,
            `  message: ${e.message}`,
            `  value:   ${preview(e.value)}`,
        ].join("\n");
    })
        .join("\n");
}
function createValidator(schema, schemaName = "Schema") {
    const compiled = compiler_1.TypeCompiler.Compile(schema);
    return (data) => {
        if (!compiled.Check(data)) {
            const errs = [...compiled.Errors(data)];
            console.error(`\n❌ ${schemaName} validation failed (${errs.length} errors)\n${formatErrors(errs)}\n`);
            throw new Error(`${schemaName} validation failed (${errs.length} errors). See console for details.`);
        }
        return data;
    };
}
const ValidateEventSearchQuery = createValidator(eventSchema_3.EventSearchSchema, "EventSearchSchema");
exports.ValidateEventSearchQuery = ValidateEventSearchQuery;
const eventValidator = createValidator(eventSchema_1.EventSchema, "EventSchema");
exports.eventValidator = eventValidator;
const eventsValidator = createValidator(eventSchema_1.EventsArraySchema, "EventsArraySchema");
exports.eventsValidator = eventsValidator;
const layoutSlotValidator = createValidator(layoutSlotSchema_1.PaginatedLayoutSchema, "PaginatedLayoutSchema");
exports.layoutSlotValidator = layoutSlotValidator;
exports.EventsByGroupIdSchemaValidator = createValidator(eventSchema_1.EventsByGroupIdSchema, "EventsByGroupIdSchema");
const GroupSchemaValidator = createValidator(groupSchema_1.GroupSchema, "GroupsSchema");
exports.GroupSchemaValidator = GroupSchemaValidator;
const GroupsSchemaValidator = createValidator(groupSchema_1.GroupsSchema, "GroupsSchema");
exports.GroupsSchemaValidator = GroupsSchemaValidator;
const NewEventSchemaValidator = createValidator(eventSchema_1.NewEventInputSchema, "NewEventInputSchema");
exports.NewEventSchemaValidator = NewEventSchemaValidator;
const ValidateGroupId = createValidator(eventSchema_2.GroupIdSchema, "GroupIdSchema");
exports.ValidateGroupId = ValidateGroupId;
const CompiledGroupIdsSchema = compiler_1.TypeCompiler.Compile(eventAttendantsSchema_1.EventIdsSchema);
exports.CompiledGroupIdsSchema = CompiledGroupIdsSchema;
//# sourceMappingURL=schemaValidators.js.map