"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMembershipSchemaValidator = exports.UserMembershipSchemaArrayValidator = exports.UserMembershipSchemaArray = exports.UserMembershipSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
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
exports.UserMembershipSchemaArrayValidator = (0, validateSchema_1.createValidator)(exports.UserMembershipSchemaArray, "UserMembershipSchemaArray");
exports.UserMembershipSchemaValidator = (0, validateSchema_1.createValidator)(exports.UserMembershipSchema, "UserMembershipSchema");
//# sourceMappingURL=userMembershipSchema.js.map