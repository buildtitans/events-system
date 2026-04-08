"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationSchemaValidator = exports.CompiledLoginCredentials = exports.LoginCredentialsSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const compiler_1 = require("@sinclair/typebox/compiler");
const LoginCredentialsSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: "email" }),
    password: typebox_1.Type.String(),
});
exports.LoginCredentialsSchema = LoginCredentialsSchema;
const AuthenticationSchema = typebox_1.Type.Object({
    success: typebox_1.Type.Boolean(),
    attendanceDict: typebox_1.Type.Object({ record: typebox_1.Type.String() }),
});
exports.CompiledLoginCredentials = compiler_1.TypeCompiler.Compile(LoginCredentialsSchema);
exports.AuthenticationSchemaValidator = compiler_1.TypeCompiler.Compile(AuthenticationSchema);
//# sourceMappingURL=loginCredentialsSchema.js.map