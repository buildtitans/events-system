
import { router, publicProcedure } from "@/src/trpc/init";
import type { GroupsSchemaType } from "@/src/schemas/groupSchema";



type GroupsResponse = {
    items: GroupsSchemaType,
    meta: {
        total: number
    }
}

export const groupsRouter = router({
    list: publicProcedure
        .mutation(async ({ ctx }): Promise<GroupsResponse> => {
            const results = await ctx.api.getGroups();

            return results;
        })
})