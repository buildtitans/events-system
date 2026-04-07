"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRouter = void 0;
const init_1 = require("@/src/server/core/context/init");
const typeBoxValidation_1 = require("../adaptors/typeBoxValidation");
const groupSchema_1 = require("@/src/schemas/groups/groupSchema");
const searchSchema_1 = require("@/src/schemas/search/searchSchema");
const eventSchema_1 = require("@/src/schemas/events/eventSchema");
const searchInputValidator = (0, typeBoxValidation_1.typeboxInput)(searchSchema_1.CompiledSearchSchema);
exports.groupsRouter = (0, init_1.router)({
    list: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.groups.getAllGroups();
    }),
    nameLookup: init_1.publicProcedure.mutation(async ({ ctx }) => {
        return await ctx.services.api.domains.groups.getGroupNameDictionary();
    }),
    createNewGroup: init_1.protectedProcedure
        .input((0, typeBoxValidation_1.typeboxInput)(groupSchema_1.NewGroupInputSchemaValidator))
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.groupLifecycle.createNewGroup(ctx.req.user?.id, input);
    }),
    groupBySlug: init_1.publicProcedure
        .input((0, typeBoxValidation_1.typeboxInput)(groupSchema_1.GroupSlugSchemaValidator))
        .mutation(async ({ ctx, input }) => {
        return await ctx.services.api.domains.groups.getGroupFromSlug(input);
    }),
    searchGroups: init_1.publicProcedure
        .input(searchInputValidator)
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