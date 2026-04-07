"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventValidator = exports.NewEventSchemaValidator = exports.GroupsSchemaValidator = exports.GroupSchemaValidator = exports.layoutSlotValidator = exports.eventsValidator = exports.ValidateEventSearchQuery = void 0;
exports.formatErrors = formatErrors;
exports.createValidator = createValidator;
require("@/src/schemas/format");
const compiler_1 = require("@sinclair/typebox/compiler");
const eventSchema_1 = require("@/src/schemas/events/eventSchema");
const layoutSlotSchema_1 = require("@/src/schemas/events/layoutSlotSchema");
const groupSchema_1 = require("@/src/schemas/groups/groupSchema");
const eventSchema_2 = require("@/src/schemas/events/eventSchema");
function preview(value, max = 160) {
    if (value == null)
        return String(value);
    try {
        const s = typeof value === "string" ? value : JSON.stringify(value);
        return s.length > max ? `${s.slice(0, max)}...(truncated)` : s;
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
            console.error(`\nValidation failed for ${schemaName} (${errs.length} errors)\n${formatErrors(errs)}\n`);
            throw new Error(`${schemaName} validation failed (${errs.length} errors). See console for details.`);
        }
        return data;
    };
}
const eventValidator = createValidator(eventSchema_1.EventSchema, "EventSchema");
exports.eventValidator = eventValidator;
const eventsValidator = createValidator(eventSchema_1.EventsArraySchema, "EventsArraySchema");
exports.eventsValidator = eventsValidator;
const layoutSlotValidator = createValidator(layoutSlotSchema_1.PaginatedLayoutSchema, "PaginatedLayoutSchema");
exports.layoutSlotValidator = layoutSlotValidator;
const GroupSchemaValidator = createValidator(groupSchema_1.GroupSchema, "GroupsSchema");
exports.GroupSchemaValidator = GroupSchemaValidator;
const GroupsSchemaValidator = createValidator(groupSchema_1.GroupsSchema, "GroupsSchema");
exports.GroupsSchemaValidator = GroupsSchemaValidator;
const NewEventSchemaValidator = createValidator(eventSchema_1.NewEventInputSchema, "NewEventInputSchema");
exports.NewEventSchemaValidator = NewEventSchemaValidator;
exports.ValidateEventSearchQuery = createValidator(eventSchema_2.EventSearchSchema, "EventSearchSchema");
//# sourceMappingURL=validateSchema.js.map