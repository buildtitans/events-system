"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledGroupSchema = exports.GroupsSchema = exports.CompiledNewGroupInputSchema = exports.CompiledGroupSlugSchema = exports.GroupSlugSchema = exports.NewGroupInputSchema = exports.GroupSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
exports.GroupSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    slug: typebox_1.Type.String(),
    description: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    location: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    category_id: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    organizer_id: typebox_1.Type.String({ format: "uuid" }),
    created_at: typebox_1.Type.String(),
    updated_at: typebox_1.Type.String(),
});
exports.NewGroupInputSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    description: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    location: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    category_id: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
});
exports.GroupSlugSchema = typebox_1.Type.String();
exports.CompiledGroupSlugSchema = compiler_1.TypeCompiler.Compile(exports.GroupSlugSchema);
exports.CompiledNewGroupInputSchema = compiler_1.TypeCompiler.Compile(exports.NewGroupInputSchema);
exports.GroupsSchema = typebox_1.Type.Array(exports.GroupSchema);
exports.CompiledGroupSchema = compiler_1.TypeCompiler.Compile(exports.GroupSchema);
//# sourceMappingURL=groupSchema.js.map