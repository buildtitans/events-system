import { publicProcedure, router } from "@/src/server/core/context/init";
import { hydrateEventsRouter } from "./hydrateEventsRouter";
import { hydrateGroupsRouter } from "./hydrateGroupsRouter";

export const hydrationRouter = router({
  app: publicProcedure.query(async ({ ctx }) => {
    const [events, groups, categories] = await Promise.all([
      ctx.api.services.domains.events.layout.discovery(),
      ctx.api.services.domains.groups.hydrate.list.discovery(),
      ctx.api.services.domains.groups.query.categories(),
    ]);
    return {
      events,
      groups,
      categories,
    };
  }),
  groups: hydrateGroupsRouter,
  events: hydrateEventsRouter,
});
