"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateGroupId = exports.ValidateEventSearchQuery = exports.eventValidator = exports.NewEventSchemaValidator = exports.GroupsSchemaValidator = exports.GroupSchemaValidator = exports.layoutSlotValidator = exports.eventsValidator = exports.CompiledGroupIdsSchema = exports.ValidateGroupMembersArray = exports.GroupRoleSchemaValidator = exports.MemberCountSchemaValidator = exports.ValidateGroupMember = exports.RsvpSchemaArrayValidator = exports.RsvpSchemaValidator = exports.RsvpStatusSchemaValidator = exports.ValidateRawAttendants = exports.validateLoginInput = exports.NotificationSchemaArrayValidator = exports.NotificationSchemaValidator = exports.UserMembershipSchemaValidator = exports.UserMembershipSchemaArrayValidator = exports.EventsByGroupIdSchemaValidator = void 0;
exports.createValidator = createValidator;
require("@/src/schemas/format");
const compiler_1 = require("@sinclair/typebox/compiler");
const eventSchema_1 = require("@/src/schemas/events/eventSchema");
const layoutSlotSchema_1 = require("@/src/schemas/events/layoutSlotSchema");
const groupSchema_1 = require("@/src/schemas/groups/groupSchema");
const eventSchema_2 = require("@/src/schemas/events/eventSchema");
const eventSchema_3 = require("@/src/schemas/events/eventSchema");
const eventAttendantsSchema_1 = require("@/src/schemas/events/eventAttendantsSchema");
const userMembershipSchema_1 = require("@/src/schemas/groups/userMembershipSchema");
const notificationsSchema_1 = require("@/src/schemas/notifications/notificationsSchema");
const loginCredentialsSchema_1 = require("@/src/schemas/auth/loginCredentialsSchema");
const rsvpSchema_1 = require("@/src/schemas/events/rsvpSchema");
const groupMembersSchema_1 = require("@/src/schemas/groups/groupMembersSchema");
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
exports.UserMembershipSchemaArrayValidator = createValidator(userMembershipSchema_1.UserMembershipSchemaArray, "UserMembershipSchemaArray");
exports.UserMembershipSchemaValidator = createValidator(userMembershipSchema_1.UserMembershipSchema, "UserMembershipSchema");
exports.NotificationSchemaValidator = createValidator(notificationsSchema_1.NotificationSchema, "NotificationsSchema");
exports.NotificationSchemaArrayValidator = createValidator(notificationsSchema_1.NotificationSchemaArray, "NotificationSchemaArray");
exports.validateLoginInput = createValidator(loginCredentialsSchema_1.LoginCredentialsSchema, "LoginCredentialsSchema");
exports.ValidateRawAttendants = createValidator(eventAttendantsSchema_1.EventAttendantsSchema, "EventAttendantsSchema");
exports.RsvpStatusSchemaValidator = createValidator(eventAttendantsSchema_1.EventAttendantStatusSchema, "EventAttendantStatusSchema");
exports.RsvpSchemaValidator = createValidator(rsvpSchema_1.RsvpSchema, "RsvpSchema");
exports.RsvpSchemaArrayValidator = createValidator(rsvpSchema_1.RsvpSchemaArray, "RsvpSchemaArray");
exports.ValidateGroupMember = createValidator(groupMembersSchema_1.GroupMemberSchema, "GroupMemberSchema");
exports.MemberCountSchemaValidator = createValidator(groupMembersSchema_1.MemberCountSchema, "MemberCountSchema");
exports.GroupRoleSchemaValidator = createValidator(groupMembersSchema_1.GroupRoleSchema, "GroupRoleSchema");
exports.ValidateGroupMembersArray = createValidator(groupMembersSchema_1.GroupMembersArraySchema, "GroupMembersArraySchema");
//# sourceMappingURL=schemaValidators.js.map