"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRPCResolverError = void 0;
class TRPCResolverError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.name = "Error within tRPC mutation resolver";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, TRPCResolverError.prototype);
    }
}
exports.TRPCResolverError = TRPCResolverError;
//# sourceMappingURL=trpcResolverError.js.map