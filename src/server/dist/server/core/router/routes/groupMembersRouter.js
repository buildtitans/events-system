"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupMembersRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const inputValidation_1 = require("../inputValidators/inputValidation");
const groupMembersRouter = (0, init_1.router)({
    addNewMember: init_1.publicProcedure
        .input(inputValidation_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.memberships.addMember(ctx.req.user?.id, input);
    }),
    leaveGroup: init_1.publicProcedure
        .input(inputValidation_1.MemberToRemoveInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.memberships.leaveGroup(input.group_id, ctx.req.user?.id);
    }),
    getViewerRole: init_1.publicProcedure
        .input(inputValidation_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.memberships.getRoleInGroup(ctx.req.user?.id, input);
    }),
    getGroupMembers: init_1.publicProcedure
        .input(inputValidation_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.getAllGroupMembers(input);
    }),
    viewerMemberships: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.participations.getMemberships(ctx.req.user?.id);
    }),
    getGroupOrganizerEmail: init_1.publicProcedure
        .input(inputValidation_1.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.getOrganizerEmail(input);
    }),
});
exports.groupMembersRouter = groupMembersRouter;
//# sourceMappingURL=groupMembersRouter.js.map