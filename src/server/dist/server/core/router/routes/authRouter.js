"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const loginCredentialsSchema_1 = require("@/src/schemas/auth/loginCredentialsSchema");
const typeBoxValidation_1 = require("../adaptors/typeBoxValidation");
exports.authRouter = (0, init_1.router)({
    login: init_1.publicProcedure
        .input((0, typeBoxValidation_1.typeboxInput)(loginCredentialsSchema_1.CompiledLoginCredentials))
        .mutation(async ({ ctx, input }) => {
        const result = await ctx.services.api.domains.session.login(input.email, input.password);
        if (result.status === "ok") {
            ctx.session.setCookieHeader(result.session, result.user);
            const attendanceDictionary = await ctx.services.api.domains.participations.getAttendanceDictionary(result.user.id);
            return {
                status: result.status,
                email: result.user.email,
                attendanceDictionary,
            };
        }
        return {
            status: result.status,
            email: undefined,
            attendanceDictionary: undefined,
        };
    }),
    signout: init_1.publicProcedure.mutation(async ({ ctx }) => {
        const res = await ctx.services.api.domains.session.logout(ctx.req.cookies.session);
        ctx.session.removeCookieHeader();
        return res;
    }),
    signup: init_1.publicProcedure
        .input((0, typeBoxValidation_1.typeboxInput)(loginCredentialsSchema_1.CompiledLoginCredentials))
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.users.createNewUser(input.email, input.password);
    }),
    recover: init_1.publicProcedure.mutation(async ({ ctx }) => {
        const session = await ctx.services.api.domains.session.recoverSession(ctx.req.cookies.session);
        if (!session) {
            ctx.session.removeCookieHeader();
            return null;
        }
        const email = await ctx.services.api.domains.users.getEmailById(session.user_id);
        return {
            session,
            email,
        };
    }),
    checkSession: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.session.recoverSession(ctx.req.cookies.session);
    }),
});
//# sourceMappingURL=authRouter.js.map