"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMembershipSchemaArray = exports.UserMembershipSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const groupMembersSchema_1 = require("./groupMembersSchema");
exports.UserMembershipSchema = typebox_1.Type.Object({
    group_id: typebox_1.Type.String({ format: "uuid" }),
    group_name: typebox_1.Type.String(),
    group_description: typebox_1.Type.String(),
    location: typebox_1.Type.String(),
    member_count: typebox_1.Type.Number(),
    group_slug: typebox_1.Type.String(),
    roleInGroup: groupMembersSchema_1.GroupRoleSchema,
});
exports.UserMembershipSchemaArray = typebox_1.Type.Array(exports.UserMembershipSchema);
//# sourceMappingURL=userMembershipSchema.js.map