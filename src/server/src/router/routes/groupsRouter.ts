import { router, publicProcedure } from "@/src/server/src/context/init";
import { typeboxInput } from "../adaptors/typeBoxValidation";
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
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

const searchInputValidator =
  typeboxInput<SearchSchemaType>(CompiledSearchSchema);

export const groupsRouter = router({
  list: publicProcedure.mutation(async ({ ctx }) => {
    const results = await ctx.api.groups.getGroups();

    return results;
  }),

  createNewGroup: publicProcedure
    .input(typeboxInput<NewGroupInputSchemaType>(NewGroupInputSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCResolverError(
          401,
          "Authentication required to create new groups",
        );
      }
      const { group, organizer } =
        await ctx.services.groupLifecycle.createNewGroup(ctx.user.id, input);

      return group;
    }),

  groupBySlug: publicProcedure
    .input(typeboxInput<GroupSlugSchemaType>(GroupSlugSchemaValidator))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.api.groups.getGroupBySlug(input);

      const userRole = ctx.auth.getRoleForGroup(
        group.id,
        ctx.cache.roleLookupMap,
      );

      return {
        group: group,
        role: userRole,
      };
    }),

  searchGroups: publicProcedure
    .input(searchInputValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.api.groups.searchGroups(input);
    }),
});
