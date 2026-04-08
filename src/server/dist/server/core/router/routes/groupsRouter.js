"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const typeBoxValidation_1 = require("../adaptors/typeBoxValidation");
const eventSchema_1 = require("@/src/schemas/events/eventSchema");
const inputValidation_1 = require("../inputValidators/inputValidation");
exports.groupsRouter = (0, init_1.router)({
    list: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.groups.getAllGroups();
    }),
    nameLookup: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.groups.getGroupNameDictionary();
    }),
    createNewGroup: init_1.protectedProcedure
        .input(inputValidation_1.newGroupInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.groupLifecycle.createNewGroup(ctx.req.user?.id, input);
    }),
    groupBySlug: init_1.publicProcedure
        .input(inputValidation_1.groupSlugInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.getGroupFromSlug(input);
    }),
    searchGroups: init_1.publicProcedure
        .input(inputValidation_1.searchInputValidator)
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.searchGroups(input);
    }),
    getNextGroupEventLookup: init_1.publicProcedure
        .input((0, typeBoxValidation_1.typeboxInputV2)(eventSchema_1.GroupIdArraySchema))
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.events.getNextEventLookupMap(input);
    }),
});
//# sourceMappingURL=groupsRouter.js.map