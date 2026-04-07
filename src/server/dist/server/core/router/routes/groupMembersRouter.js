"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupMembersRouter = exports.groupIdInputValidator = void 0;
const init_1 = require("@/src/server/core/context/init");
const typeBoxValidation_1 = require("../adaptors/typeBoxValidation");
const groupMembersSchema_1 = require("@/src/schemas/groups/groupMembersSchema");
exports.groupIdInputValidator = (0, typeBoxValidation_1.typeboxInput)(groupMembersSchema_1.GroupIDForInsertSchemaValidator);
const groupMembersRouter = (0, init_1.router)({
    addNewMember: init_1.publicProcedure
        .input(exports.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.memberships.addMember(ctx.req.user?.id, input);
    }),
    leaveGroup: init_1.publicProcedure
        .input(groupMembersSchema_1.MemberToRemoveInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.memberships.leaveGroup(input.group_id, ctx.req.user?.id);
    }),
    getViewerRole: init_1.publicProcedure
        .input(exports.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.memberships.getRoleInGroup(ctx.req.user?.id, input);
    }),
    getGroupMembers: init_1.publicProcedure
        .input(exports.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.getAllGroupMembers(input);
    }),
    viewerMemberships: init_1.protectedProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.participations.getMemberships(ctx.req.user?.id);
    }),
    getGroupOrganizerEmail: init_1.publicProcedure
        .input(exports.groupIdInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.getOrganizerEmail(input);
    }),
});
exports.groupMembersRouter = groupMembersRouter;
//# sourceMappingURL=groupMembersRouter.js.map