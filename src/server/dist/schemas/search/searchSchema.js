"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompiledSearchSchema = exports.SearchSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
exports.SearchSchema = typebox_1.Type.String();
exports.CompiledSearchSchema = compiler_1.TypeCompiler.Compile(exports.SearchSchema);
//# sourceMappingURL=searchSchema.js.map