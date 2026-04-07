"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.publicProcedure = exports.protectedProcedure = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
});
const router = t.router;
exports.router = router;
const publicProcedure = t.procedure;
exports.publicProcedure = publicProcedure;
const requireAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.req.user?.id) {
        throw new server_1.TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required to access this resource",
        });
    }
    return next({
        ctx,
    });
});
const protectedProcedure = t.procedure.use(requireAuth);
exports.protectedProcedure = protectedProcedure;
//# sourceMappingURL=init.js.map