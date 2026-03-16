import { router, publicProcedure } from "@/src/server/src/context/init";
import { typeboxInput, typeboxInputV2 } from "../adaptors/typeBoxValidation";
import {
  GroupSlugSchemaType,
  GroupSlugSchemaValidator,
  NewGroupInputSchemaType,
  NewGroupInputSchemaValidator,
} from "@/src/schemas/groups/groupSchema";
import {
  CompiledSearchSchema,
  SearchSchemaType,
} from "@/src/schemas/search/searchSchema";
import { GroupIdArraySchema } from "@/src/schemas/events/eventSchema";

const searchInputValidator =
  typeboxInput<SearchSchemaType>(CompiledSearchSchema);

export const groupsRouter = router({
  list: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.services.api.domains.groups.getAllGroups();
  }),

  createNewGroup: publicProcedure
    .input(typeboxInput<NewGroupInputSchemaType>(NewGroupInputSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.groupLifecycle.createNewGroup(
        ctx.req.user?.id,
        input,
      );
    }),

  groupBySlug: publicProcedure
    .input(typeboxInput<GroupSlugSchemaType>(GroupSlugSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.getGroupFromSlug(input);
    }),

  searchGroups: publicProcedure
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.groups.searchGroups(input);
    }),

  getNextGroupEventLookup: publicProcedure
    .input(typeboxInputV2<GroupIdArraySchema>(GroupIdArraySchema))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.api.domains.events.getNextEventLookupMap(input);
    }),
});
