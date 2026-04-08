"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUserSchema = exports.DbUserSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const PublicUserSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    id: typebox_1.Type.String()
});
exports.PublicUserSchema = PublicUserSchema;
const DbUserSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    id: typebox_1.Type.String(),
    password_hash: typebox_1.Type.String()
});
exports.DbUserSchema = DbUserSchema;
//# sourceMappingURL=userSchema.js.map