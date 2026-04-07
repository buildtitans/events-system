"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberToRemoveInputValidator = exports.ValidateGroupMembersArray = exports.GroupRoleSchemaValidator = exports.MemberCountSchemaValidator = exports.ValidateGroupMember = exports.GroupMemberSchemaValidator = exports.CompiledMemberToRemoveSchema = exports.GroupIDForInsertSchemaValidator = exports.GroupIDForInsertSchema = exports.GroupMemberSchema = exports.MemberCountSchema = exports.GroupRoleSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const typeBoxValidation_1 = require("@/src/server/core/router/adaptors/typeBoxValidation");
exports.GroupRoleSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal("member"),
    typebox_1.Type.Literal("organizer"),
    typebox_1.Type.Literal("anonymous"),
]);
const GroupMemberSchema = typebox_1.Type.Object({
    group_id: typebox_1.Type.String(),
    user_id: typebox_1.Type.String(),
    role: typebox_1.Type.Union([
        typebox_1.Type.Literal("member"),
        typebox_1.Type.Literal("organizer"),
        typebox_1.Type.Literal("anonymous"),
    ]),
    joined_at: typebox_1.Type.String(),
});
exports.GroupMemberSchema = GroupMemberSchema;
exports.MemberCountSchema = typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Number());
const MemberToRemoveSchema = typebox_1.Type.Object({
    group_id: typebox_1.Type.String({ format: "uuid" }),
});
const GroupIDForInsertSchema = typebox_1.Type.String();
exports.GroupIDForInsertSchema = GroupIDForInsertSchema;
const GroupMembersArraySchema = typebox_1.Type.Array(GroupMemberSchema);
exports.GroupIDForInsertSchemaValidator = compiler_1.TypeCompiler.Compile(GroupIDForInsertSchema);
exports.CompiledMemberToRemoveSchema = compiler_1.TypeCompiler.Compile(MemberToRemoveSchema);
exports.GroupMemberSchemaValidator = compiler_1.TypeCompiler.Compile(GroupMemberSchema);
exports.ValidateGroupMember = (0, validateSchema_1.createValidator)(GroupMemberSchema, "GroupMemberSchema");
exports.MemberCountSchemaValidator = (0, validateSchema_1.createValidator)(exports.MemberCountSchema, "MemberCountSchema");
exports.GroupRoleSchemaValidator = (0, validateSchema_1.createValidator)(exports.GroupRoleSchema, "GroupRoleSchema");
exports.ValidateGroupMembersArray = (0, validateSchema_1.createValidator)(GroupMembersArraySchema, "GroupMembersArraySchema");
exports.MemberToRemoveInputValidator = (0, typeBoxValidation_1.typeboxInput)(exports.CompiledMemberToRemoveSchema);
//# sourceMappingURL=groupMembersSchema.js.map