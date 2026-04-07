"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInputSchemaValidator = exports.CompiledSearchSchema = exports.SearchSchema = void 0;
const typeBoxValidation_1 = require("@/src/server/core/router/adaptors/typeBoxValidation");
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
exports.SearchSchema = typebox_1.Type.String();
exports.CompiledSearchSchema = compiler_1.TypeCompiler.Compile(exports.SearchSchema);
exports.SearchInputSchemaValidator = (0, typeBoxValidation_1.typeboxInput)(exports.CompiledSearchSchema);
//# sourceMappingURL=searchSchema.js.map