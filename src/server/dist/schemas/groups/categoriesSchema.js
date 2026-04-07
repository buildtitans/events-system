"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCategoriesResponseValidator = exports.GetAllCategoriesResponse = exports.CategoriesValidator = exports.CategoriesSchema = exports.CategorySchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
exports.CategorySchema = typebox_1.Type.Object({
    icon: typebox_1.Type.String(),
    id: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    slug: typebox_1.Type.String(),
});
exports.CategoriesSchema = typebox_1.Type.Array(exports.CategorySchema);
exports.CategoriesValidator = compiler_1.TypeCompiler.Compile(exports.CategoriesSchema);
exports.GetAllCategoriesResponse = typebox_1.Type.Object({
    items: exports.CategoriesSchema,
    meta: typebox_1.Type.Object({
        total: typebox_1.Type.Number(),
        error: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
        message: typebox_1.Type.String(),
    }),
});
exports.GetAllCategoriesResponseValidator = compiler_1.TypeCompiler.Compile(exports.GetAllCategoriesResponse);
//# sourceMappingURL=categoriesSchema.js.map