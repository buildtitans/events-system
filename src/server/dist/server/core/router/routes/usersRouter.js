"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
exports.usersRouter = (0, init_1.router)({
    getUserEmail: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.users.getEmailById(ctx.req.user?.id);
    }),
    userMemberships: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.participations.getMemberships(ctx.req.user?.id);
    }),
    rsvpsToEvents: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.participations.getRsvpdEvents(ctx.req.user?.id);
    }),
    createdGroups: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.users.getGroupsCreated(ctx.req.user?.id);
    }),
});
//# sourceMappingURL=usersRouter.js.map