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
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";
import { getNextGroupEventLookup } from "@/src/lib/store/slices/user/userSlice";
import {
  CompiledGroupIdsSchema,
  ValidateGroupId,
} from "../../lib/validation/schemaValidators";
import {
  GroupIdArraySchema,
  GroupIdSchema,
  GroupIdSchemaType,
} from "@/src/schemas/events/eventSchema";

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
      const group =
        await ctx.services.api.domains.groups.getGroupFromSlug(input);

      console.log(group);

      const userRole =
        await ctx.services.api.domains.groups.memberships.getRoleInGroup(
          ctx.req.user?.id,
          group.id,
        );

      console.log(userRole);

      return {
        group: group,
        role: userRole,
      };
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
