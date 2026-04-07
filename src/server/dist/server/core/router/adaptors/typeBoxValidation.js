"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeboxInput = typeboxInput;
exports.typeboxInputV2 = typeboxInputV2;
const compiler_1 = require("@sinclair/typebox/compiler");
const server_1 = require("@trpc/server");
function typeboxInput(validator) {
    return (raw) => {
        if (!validator.Check(raw)) {
            throw new server_1.TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid input",
            });
        }
        return raw;
    };
}
function typeboxInputV2(schema) {
    const validator = compiler_1.TypeCompiler.Compile(schema);
    return (raw) => {
        if (!validator.Check(raw)) {
            throw new server_1.TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid input",
            });
        }
        return raw;
    };
}
//# sourceMappingURL=typeBoxValidation.js.map