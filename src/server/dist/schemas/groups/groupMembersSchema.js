"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMemberSchemaValidator = exports.CompiledMemberToRemoveSchema = exports.GroupIDForInsertSchemaValidator = exports.GroupIDForInsertSchema = exports.GroupMemberSchema = exports.GroupMembersArraySchema = exports.MemberCountSchema = exports.GroupRoleSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
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
exports.GroupMembersArraySchema = typebox_1.Type.Array(GroupMemberSchema);
exports.GroupIDForInsertSchemaValidator = compiler_1.TypeCompiler.Compile(GroupIDForInsertSchema);
exports.CompiledMemberToRemoveSchema = compiler_1.TypeCompiler.Compile(MemberToRemoveSchema);
exports.GroupMemberSchemaValidator = compiler_1.TypeCompiler.Compile(GroupMemberSchema);
//# sourceMappingURL=groupMembersSchema.js.map